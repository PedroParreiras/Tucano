# Federation

## Supported federation protocols and standards

- [ActivityPub](https://www.w3.org/TR/activitypub/) (Server-to-Server)
- [WebFinger](https://webfinger.net/)
- [Http Signatures](https://datatracker.ietf.org/doc/html/draft-cavage-http-signatures)
- [NodeInfo](https://nodeinfo.diaspora.software/)

## Supported FEPs

- [FEP-67ff: FEDERATION.md](https://codeberg.org/fediverse/fep/src/branch/main/fep/67ff/fep-67ff.md)
- [FEP-f1d5: NodeInfo in Fediverse Software](https://codeberg.org/fediverse/fep/src/branch/main/fep/f1d5/fep-f1d5.md)
- [FEP-8fcf: Followers collection synchronization across servers](https://codeberg.org/fediverse/fep/src/branch/main/fep/8fcf/fep-8fcf.md)
- [FEP-5feb: Search indexing consent for actors](https://codeberg.org/fediverse/fep/src/branch/main/fep/5feb/fep-5feb.md)

## ActivityPub in tucano

tucano largely follows the ActivityPub server-to-server specification but it makes uses of some non-standard extensions, some of which are required for interacting with tucano at all.

- [Supported ActivityPub vocabulary](https://docs.jointucano.org/spec/activitypub/)

### Required extensions

#### WebFinger

In tucano, users are identified by a `username` and `domain` pair (e.g., `Gargron@tucano.social`).
This is used both for discovery and for unambiguously mentioning users across the fediverse. Furthermore, this is part of tucano's database design from its very beginnings.

As a result, tucano requires that each ActivityPub actor uniquely maps back to an `acct:` URI that can be resolved via WebFinger.

- [WebFinger information and examples](https://docs.jointucano.org/spec/webfinger/)

#### HTTP Signatures

In order to authenticate activities, tucano relies on HTTP Signatures, signing every `POST` and `GET` request to other ActivityPub implementations on behalf of the user authoring an activity (for `POST` requests) or an actor representing the tucano server itself (for most `GET` requests).

tucano requires all `POST` requests to be signed, and MAY require `GET` requests to be signed, depending on the configuration of the tucano server.

- [HTTP Signatures information and examples](https://docs.jointucano.org/spec/security/#http)

### Optional extensions

- [Linked-Data Signatures](https://docs.jointucano.org/spec/security/#ld)
- [Bearcaps](https://docs.jointucano.org/spec/bearcaps/)

### Additional documentation

- [tucano documentation](https://docs.jointucano.org/)
