import bcrypt from "bcrypt";
import { scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const DEFAULT_BCRYPT_ROUNDS = 12;

function isBcryptHash(value: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(value);
}

function getBcryptRounds(): number {
  const parsedRounds = Number(process.env.BCRYPT_SALT_ROUNDS);

  if (Number.isInteger(parsedRounds) && parsedRounds >= 10 && parsedRounds <= 14) {
    return parsedRounds;
  }

  return DEFAULT_BCRYPT_ROUNDS;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, getBcryptRounds());
}

export async function verifyPassword(
  password: string,
  storedPassword: string | null | undefined
) {
  const result = await verifyPasswordWithMigration(password, storedPassword);
  return result.isValid;
}

export async function verifyPasswordWithMigration(
  password: string,
  storedPassword: string | null | undefined
) {
  if (!storedPassword) return { isValid: false, shouldRehash: false };

  if (isBcryptHash(storedPassword)) {
    const isValid = await bcrypt.compare(password, storedPassword);
    return { isValid, shouldRehash: false };
  }

  const [salt, savedHash] = storedPassword.split(":");
  if (!salt || !savedHash) return { isValid: false, shouldRehash: false };

  const hashedBuffer = scryptSync(password, salt, KEY_LENGTH);
  const savedBuffer = Buffer.from(savedHash, "hex");

  if (hashedBuffer.length !== savedBuffer.length) {
    return { isValid: false, shouldRehash: false };
  }

  const isValid = timingSafeEqual(hashedBuffer, savedBuffer);

  return {
    isValid,
    shouldRehash: isValid,
  };
}
