import { getStoredCustomImage, setStorage, storageKeys } from "./storage";

export function base64ToBlob(base64: string) {
  const contentType = base64.match(/data:([^;]+);base64,/)?.[1];
  if (!contentType) throw new Error("Invalid base64 format");
  const base64Data = base64.replace(/data:([^;]+);base64,/, "");
  const binaryData = atob(base64Data);
  const length = binaryData.length;
  const uint8Array = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: contentType });
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as string"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

export async function getCustomImageUrl() {
  try {
    const { [storageKeys.customImage]: image } = await getStoredCustomImage();
    if (!image) return "";

    return URL.createObjectURL(base64ToBlob(image as string));
  } catch (error) {
    console.error("Error loading custom image:", error);
    return "";
  }
}

export function selectImageFile(
  onSelect: (image: File, base64: string) => void | Promise<void>,
) {
  const input = document.createElement("input");
  input.type = "File";
  input.accept = "image/*";
  input.onchange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const image = target.files?.[0];
    if (!image) return;

    if (!image.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    await onSelect(image, await blobToBase64(image));
  };
  input.click();
}

export async function storeCustomImage(base64: string) {
  await setStorage({ [storageKeys.customImage]: base64 });
}
