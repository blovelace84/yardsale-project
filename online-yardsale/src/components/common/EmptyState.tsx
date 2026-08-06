import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;

  actionText?: string;
  actionTo?: string;
  onAction?: () => void;

  secondaryActionText?: string;
  secondaryActionTo?: string;
  onSecondaryAction?: () => void;

  children?: ReactNode;
}

function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionTo,
  onAction,
  secondaryActionText,
  secondaryActionTo,
  onSecondaryAction,
  children,
}: EmptyStateProps) {
  return (
    <section className="flex w-full justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
        {icon && (
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            {icon}
          </div>
        )}

        <h2 className="mt-6 text-2xl font-bold text-slate-900">{title}</h2>

        {description && (
          <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
            {description}
          </p>
        )}

        {children && <div className="mt-6">{children}</div>}

        {(actionText || secondaryActionText) && (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {actionText &&
              (actionTo ? (
                <Link
                  to={actionTo}
                  onClick={onAction}
                  className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 sm:w-auto"
                >
                  {actionText}
                </Link>
              ) : (
                <button
                  onClick={onAction}
                  className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 sm:w-auto"
                >
                  {actionText}
                </button>
              ))}

            {secondaryActionText &&
              (secondaryActionTo ? (
                <Link
                  to={secondaryActionTo}
                  onClick={onSecondaryAction}
                  className="inline-flex w-full items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200 sm:w-auto"
                >
                  {secondaryActionText}
                </Link>
              ) : (
                <button
                  onClick={onSecondaryAction}
                  className="inline-flex w-full items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200 sm:w-auto"
                >
                  {secondaryActionText}
                </button>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default EmptyState;
