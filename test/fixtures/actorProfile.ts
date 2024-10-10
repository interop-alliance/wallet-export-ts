// Sample Mastodon profile circa Oct 2024
export const actorProfile = {
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://w3id.org/security/v1",
    {
      "manuallyApprovesFollowers": "as:manuallyApprovesFollowers",
      "toot": "http://joinmastodon.org/ns#",
      "featured": {
        "@id": "toot:featured",
        "@type": "@id"
      },
      "featuredTags": {
        "@id": "toot:featuredTags",
        "@type": "@id"
      },
      "alsoKnownAs": {
        "@id": "as:alsoKnownAs",
        "@type": "@id"
      },
      "movedTo": {
        "@id": "as:movedTo",
        "@type": "@id"
      },
      "schema": "http://schema.org#",
      "PropertyValue": "schema:PropertyValue",
      "value": "schema:value",
      "discoverable": "toot:discoverable",
      "Device": "toot:Device",
      "Ed25519Signature": "toot:Ed25519Signature",
      "Ed25519Key": "toot:Ed25519Key",
      "Curve25519Key": "toot:Curve25519Key",
      "EncryptedMessage": "toot:EncryptedMessage",
      "publicKeyBase64": "toot:publicKeyBase64",
      "deviceId": "toot:deviceId",
      "claim": {
        "@type": "@id",
        "@id": "toot:claim"
      },
      "fingerprintKey": {
        "@type": "@id",
        "@id": "toot:fingerprintKey"
      },
      "identityKey": {
        "@type": "@id",
        "@id": "toot:identityKey"
      },
      "devices": {
        "@type": "@id",
        "@id": "toot:devices"
      },
      "messageFranking": "toot:messageFranking",
      "messageType": "toot:messageType",
      "cipherText": "toot:cipherText",
      "suspended": "toot:suspended",
      "Hashtag": "as:Hashtag",
      "focalPoint": {
        "@container": "@list",
        "@id": "toot:focalPoint"
      }
    }
  ],
  "id": "https://example.com/users/alice",
  "type": "Person",
  "following": "https://example.com/users/alice/following",
  "followers": "https://example.com/users/alice/followers",
  "inbox": "https://example.com/users/alice/inbox",
  "outbox": "outbox.json",
  "featured": "https://example.com/users/alice/collections/featured",
  "featuredTags": "https://example.com/users/alice/collections/tags",
  "preferredUsername": "alice",
  "name": "Alice",
  "summary": "<p>Profile description goes here.<br />(she/her) <a href=\"https://example.com/tags/nobot\" class=\"mention hashtag\" rel=\"tag\">#<span>nobot</span></a></p>",
  "url": "https://example.com/@alice",
  "manuallyApprovesFollowers": false,
  "discoverable": true,
  "published": "2022-11-24T00:00:00Z",
  "devices": "https://example.com/users/alice/collections/devices",
  "alsoKnownAs": [
    "https://alice.example"
  ],
  "publicKey": {
    "id": "https://example.com/users/alice#main-key",
    "owner": "https://example.com/users/alice",
    "publicKeyPem": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzPpH+K1JcB3fH7889Lt\nJIwV2nhU0TovHRsDT2SN3Ew/c03YxEIjICJUy3rrejNOyLL0cegspzRYQDrEIbh8\nsIxuNB7wdHajjW9KkF/yvKHKuXT9RXIB4HIXXzkdjEpVrEJgn5LnLZyyWb4ZXBPF\nyhVf0l3+OcQ5hcS7WinVAbcoLU5G3eMa7w4QV6+kEkoRzGUHMtlQMWtLePAKgWM1\nXsLFC3ZPNk/j4gvHPKWmN+hhLSoB4nIJ91dEDeg12OfpIgbnEPzFyXhopVn2GmJ8\n163omcPS5tpheMNxkkYXOmG+qzVFzCXACSXmual/sRP8z+44Z92ONKjg01+5aeMN\n+QIDAQAB\n-----END PUBLIC KEY-----\n"
  },
  "tag": [
    {
      "type": "Hashtag",
      "href": "https://example.com/tags/nobot",
      "name": "#nobot"
    }
  ],
  "attachment": [],
  "endpoints": {
    "sharedInbox": "https://example.com/inbox"
  },
  "icon": {
    "type": "Image",
    "mediaType": "image/jpeg",
    "url": "avatar.jpg"
  },
  "likes": "likes.json",
  "bookmarks": "bookmarks.json"
}
