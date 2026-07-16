import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CreateListing from "./CreatListing";

const mockNavigate = vi.fn();

const mockUseAuth = vi.fn();

const mockUploadListingImages = vi.fn();
const mockCreateListing = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../services/uploadService", () => ({
  validateListingImage: vi.fn(),
  uploadListingImages: (...args: unknown[]) =>
    mockUploadListingImages(...args),
}));

vi.mock("../services/listingServices", () => ({
  createListing: (...args: unknown[]) => mockCreateListing(...args),
}));

function renderCreateListing() {
  return render(
    <MemoryRouter>
      <CreateListing />
    </MemoryRouter>,
  );
}

describe("CreateListing publish flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: {
        uid: "user-1",
        email: "seller@example.com",
        displayName: "Seller",
      },
      isAuthLoading: false,
    });

    mockUploadListingImages.mockResolvedValue([
      {
        url: "https://example.com/img.jpg",
        path: "listing-images/user-1/upload-1/img.jpg",
      },
    ]);

    mockCreateListing.mockResolvedValue({ id: "listing-123" });
  });

  it("shows a validation message when Publish listing is clicked with empty form", async () => {
    const user = userEvent.setup();

    renderCreateListing();

    await user.click(
      screen.getByRole("button", { name: "Publish listing" }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Enter a title for your listing.");

    expect(mockUploadListingImages).not.toHaveBeenCalled();
    expect(mockCreateListing).not.toHaveBeenCalled();
  });

  it("publishes a listing and navigates to listing details", async () => {
    const user = userEvent.setup();

    renderCreateListing();

    await user.type(
      screen.getByLabelText("Title"),
      "Solid wood dining table",
    );

    await user.type(
      screen.getByLabelText("Description"),
      "Great condition with minor wear.",
    );

    await user.type(screen.getByLabelText("Price"), "150");

    await user.selectOptions(
      screen.getByLabelText("Category"),
      "Furniture",
    );

    await user.type(screen.getByLabelText("Item location"), "Raleigh, NC");

    const imageInput = document.getElementById(
      "listing-images",
    ) as HTMLInputElement;

    const file = new File(["image"], "table.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(imageInput, {
      target: { files: [file] },
    });

    await user.click(
      screen.getByRole("button", { name: "Publish listing" }),
    );

    await waitFor(() => {
      expect(mockUploadListingImages).toHaveBeenCalledTimes(1);
      expect(mockCreateListing).toHaveBeenCalledTimes(1);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/listing/listing-123");
  });
});
