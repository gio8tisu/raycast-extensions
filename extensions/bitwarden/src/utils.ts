import { getPreferenceValues, Icon } from "@raycast/api";
import { Item, PasswordGeneratorOptions, Preferences, SendCreateOptions } from "./types";
import { ObjectEntries } from "./types/global";
import { URL } from "url";

Object.typedEntries = <T>(obj: T) => Object.entries(obj) as ObjectEntries<T>;

export function codeBlock(content: string): string {
  return "```\n" + content + "\n```";
}

export function getServerUrlPreference(): string {
  const { serverUrl } = getPreferenceValues<Preferences>();
  if (serverUrl === "" || serverUrl === "bitwarden.com" || serverUrl === "https://bitwarden.com") {
    return "";
  }
  return serverUrl;
}

export function faviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://icons.bitwarden.net/${domain}/icon.png`;
  } catch (err) {
    return Icon.Globe;
  }
}

export function titleCase(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getPasswordGeneratingArgs(options: PasswordGeneratorOptions): string[] {
  return Object.entries(options).flatMap(([arg, value]) => (value ? [`--${arg}`, value] : []));
}

export function encodeSendCreateOptions(options: SendCreateOptions): string {
  const obj = {
    object: "send",
    name: options.name ?? "Send name",
    notes: options.notes ?? "Some notes about this send.",
    type: 0,
    file: null,
    maxAccessCount: options.maxAccessCount,
    expirationDate: null,
    password: options.password,
    disabled: false, // TODO: Add form field for this.
    hideEmail: false, // TODO: Add form field for this.
    ...options,
  };
  return btoa(JSON.stringify(obj));
}

export const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export function extractKeywords(item: Item): string[] {
  const keywords: (string | null | undefined)[] = [item.name];
  if (item.card) {
    const { brand, number } = item.card;
    keywords.push(brand);
    if (number !== null) {
      // Similar to Bitwarden, use the last 5 digits if the card is Amex
      const isAmex = /^3[47]/.test(number);
      keywords.push(number.substring(number.length - (isAmex ? 5 : 4), number.length));
    }
  }
  keywords.push(item.login?.username);
  if (item.login?.uris) {
    for (const uri of item.login.uris) {
      if (uri.uri !== null) {
        try {
          keywords.push(...new URL(uri.uri).hostname.split("."));
        } catch (error) {
          // Invalid hostname
        }
      }
    }
  }
  // Unique keywords
  const uniqueKeywords = new Set(keywords.filter((keyword): keyword is string => !!keyword));
  return [...uniqueKeywords];
}
