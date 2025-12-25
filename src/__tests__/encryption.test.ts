import { describe, it, expect, vi } from "vitest";
import { encryptData, decryptData } from "../main/config";

// Mock Electron
vi.mock("electron", () => {
    return {
        app: {
            getPath: vi.fn().mockReturnValue("C:\\test_path"),
        },
        safeStorage: {
            isEncryptionAvailable: vi.fn().mockReturnValue(true),
            encryptString: vi.fn((str) => Buffer.from("encrypted-" + str)),
            decryptString: vi.fn((buf) => buf.toString().replace("encrypted-", "")),
        },
    };
});

describe("Système de Chiffrement (config.ts)", () => {
    it("doit chiffrer une chaîne de caractères en base64", () => {
        const secret = "mon-mot-de-passe-ultra-secret";
        const encrypted = encryptData(secret);

        expect(encrypted).toBeDefined();
        expect(typeof encrypted).toBe("string");
        // En mock, "encrypted-mon-mot-de-passe-ultra-secret" en base64
        expect(Buffer.from(encrypted, "base64").toString()).toContain("encrypted-");
    });

    it("doit déchiffrer correctement une donnée chiffrée", () => {
        const secret = "secret123";
        const encrypted = encryptData(secret);
        const decrypted = decryptData(encrypted);

        expect(decrypted).toBe(secret);
    });

    it("doit gérer le fallback en cas d'indisponibilité de safeStorage", async () => {
        const { safeStorage } = await import("electron");
        vi.mocked(safeStorage.isEncryptionAvailable).mockReturnValue(false);

        const secret = "fallback-test";
        const encrypted = encryptData(secret);
        const decrypted = decryptData(encrypted);

        expect(decrypted).toBe(secret);
        // En fallback (base64 simple), le décodage direct doit donner le texte clair
        expect(Buffer.from(encrypted, "base64").toString()).toBe(secret);
    });

    it("doit retourner null si le déchiffrement échoue", async () => {
        const { safeStorage } = await import("electron");
        vi.mocked(safeStorage.isEncryptionAvailable).mockReturnValue(true);
        vi.mocked(safeStorage.decryptString).mockImplementation(() => {
            throw new Error("Decryption error");
        });

        const result = decryptData("mauvaise-donnee-base64");
        expect(result).toBeNull();
    });
});
