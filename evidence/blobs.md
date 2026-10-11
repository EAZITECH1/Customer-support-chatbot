# Mainnet Blob Evidence — Walrus Dev Support

Every record below was generated and committed during real developer support sessions using Walrus Memory (`@mysten-incubation/memwal-mcp` v0.0.7) on **Sui Mainnet** / **Walrus Mainnet**.

- **MemWalAccount Object**: [`0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4`](https://suiscan.xyz/mainnet/object/0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4) (Sui Mainnet Shared Object)
- **Delegate Account**: `0x3d67903dd4d875d2ebfbba47fed2d7eb09e927e6049374ce7ed522a085577610`
- **Total Blobs on Walrus**: **17 Blobs** verified via `memwal_restore` sidecar telemetry across active namespaces.

---

## 1. Blob Counts by Namespace

Verified via live `memwal_restore` sidecar indexing:

| Namespace | Unique Resolutions / Tickets | Total Blobs on Walrus | Status |
| :--- | :--- | :--- | :--- |
| `support` | 4 unique resolutions | **9 blobs** | Live / Indexed |
| `open-tickets` | 3 active/escalated tickets | **6 blobs** | Live / Indexed |
| `product-intel` | 1 recurring system pattern | **2 blobs** | Live / Indexed |
| **Total** | **8 Unique Records** | **17 Blobs on Walrus** | **Verified** |

> **Note on Counts vs Deduplication:**  
> In `memwal_recall`, the relayer performs vector similarity search and automatically collapses duplicate copies (e.g., `(1 duplicate copy of the above collapsed)`). The raw blob count is higher (17 blobs) because during heavy relayer load, relayer response timeouts ([Issue #814](https://github.com/MystenLabs/MemWal/issues/814)) led to retried writes while the underlying blob had already landed on Walrus storage nodes.

---

## 2. Verifiable Blob IDs on Walruscan

These specific blob hashes were captured on clean responses and verified inspectable on [Walruscan (Mainnet)](https://walruscan.com/mainnet):

| Namespace | Topic / Resolution | Blob Hash & Explorer Link |
| :--- | :--- | :--- |
| `product-intel` | Recurring blurry video export pattern | [`vPVfOyZZd8U7MUW1IxX6aPBSxRdcBeLCwcbbz7CjUFA`](https://walruscan.com/mainnet/blob/vPVfOyZZd8U7MUW1IxX6aPBSxRdcBeLCwcbbz7CjUFA) |
| `open-tickets` | Discord role-sync failure escalation (Tier 2 handoff) | [`7Yxc8cjqpxmjS-GrVsFqFfPDNXo_mkazOLz451gASPI`](https://walruscan.com/mainnet/blob/7Yxc8cjqpxmjS-GrVsFqFfPDNXo_mkazOLz451gASPI) |
| `open-tickets` | Escalation ticket state update | [`njZbsQ-lu2-75AaWYdPxU5ubk2YnFU5ozxUcroDukL8`](https://walruscan.com/mainnet/blob/njZbsQ-lu2-75AaWYdPxU5ubk2YnFU5ozxUcroDukL8) |
| `support` | Gas coin merge resolution (`sui client gas merge-coins`) | `JEHdjNH5…` *(captured in live session logs)* |

---

## 3. Catalog of All Stored Memories

### Namespace: `support` (9 Blobs Total)

#### Record 1: Gas Coin Fragmentation during `walrus store`
* **Written**: 2026-10-09
* **Confidence**: 0.99 (Verified)
* **Structured Payload**:
```json
{
  "memory_type": "verified_resolution",
  "product_area": "cli",
  "symptom": "Error: Insufficient gas coins to cover storage and gas fees, even with sufficient SUI balance.",
  "context": "Walrus CLI, Sui Mainnet, user had 10 SUI fragmented across multiple smaller coins.",
  "attempted": "Tried `walrus store backup.tar.gz --epochs 5`",
  "ruled_out": "Insufficient total SUI balance.",
  "worked": "The user merged their fragmented SUI gas coins into a single larger coin using `sui client gas merge-coins --primary-coin <COIN_ID> --all`. After merging, the `walrus store` command executed successfully.",
  "root_cause": "Sui network's gas coin selection mechanism requires a single coin to cover the entire transaction cost (storage deposit + execution budget), and does not automatically combine fragmented smaller coins.",
  "verification": "The user confirmed that merging the gas coins allowed the `walrus store` command to execute successfully and provided a Blob ID."
}
```

#### Record 2: Empty Results on `memwal_recall` (Namespace Scoping)
* **Written**: 2026-10-11
* **Confidence**: 0.99 (Verified)
* **Structured Payload**:
```json
{
  "memory_type": "verified_resolution",
  "product_area": "memory",
  "symptom": "memwal_recall returns empty search results even after memories were successfully saved with memwal_remember.",
  "context": "Developer saved memories using memwal_remember with a specific namespace (e.g., 'my-app'), but then called memwal_recall without specifying any namespace.",
  "attempted": "Called memwal_recall without the 'namespace' parameter.",
  "ruled_out": "Incorrect function usage, network issues, no memories stored.",
  "worked": "Specifying the correct namespace (e.g., 'my-app') in the memwal_recall call returned all expected memories.",
  "root_cause": "The memwal_recall function requires the correct namespace to be specified to retrieve memories that were saved to a particular namespace. If no namespace is specified in memwal_recall, it searches the default session namespace, not the custom namespace where the memories were stored.",
  "verification": "The developer confirmed that adding the 'namespace' parameter to memwal_recall resolved the issue and returned the saved memories."
}
```

#### Record 3: Unscoped Namespace Fallback
* **Written**: 2026-10-09
* **Confidence**: 0.95 (Verified)
* **Symptom**: Recall calls without a namespace returned no results, even though memories were saved before.
* **Worked**: Specifying the explicit namespace (`my-app`) in the `memwal_recall` call returned all memories.
* **Root Cause**: The recall function requires the exact namespace to be specified to retrieve scoped partition memories.

#### Record 4: Hardware Acceleration Playback Stutter
* **Written**: 2026-09-24
* **Confidence**: Verified
* **Symptom**: WebM video export stuttering on Safari.
* **Worked**: Enabling WebGL 2.0 in Safari Develop settings resolved the issue.
* **Root Cause**: Hardware acceleration was disabled, causing playback stutter.

---

### Namespace: `open-tickets` (6 Blobs Total)

#### Ticket 1: Private Blob Key Rotation on Sui Mainnet
* **Written**: 2026-10-09
* **Status**: Open / Tier 2 Escalation
* **Developer**: `ajayiisrael523@gmail.com`
* **Issue**: Developer asking how to rotate developer decryption keys for private blobs without re-uploading the underlying Walrus blob.
* **Context**: Sui Mainnet, key management using Walrus Console. Logged as open ticket for Tier 2 systems specialist.

#### Ticket 2: Discord Community Bot Role-Sync Failure
* **Written**: 2026-08-27
* **Status**: Open / Tier 2 Escalation
* **Issue**: Discord community bot stopped syncing member roles.
* **Attempted**: Token was re-checked and bot was re-invited.
* **Escalation**: Forwarded to Tier 2 with state saved across blobs [`7Yxc8cjq…`](https://walruscan.com/mainnet/blob/7Yxc8cjqpxmjS-GrVsFqFfPDNXo_mkazOLz451gASPI) and [`njZbsQ-lu…`](https://walruscan.com/mainnet/blob/njZbsQ-lu2-75AaWYdPxU5ubk2YnFU5ozxUcroDukL8).

#### Ticket 3: Video Export Resolution Mismatch
* **Written**: 2026-09-24
* **Status**: Resolved
* **Summary**: Customer confirmed fix after changing export preset from 720p to 1080p.

---

### Namespace: `product-intel` (2 Blobs Total)

#### Intel 1: Export Preset Downscale Pattern
* **Written**: 2026-08-27
* **Status**: Aggregated Pattern
* **Blob Hash**: [`vPVfOyZZd8U7MUW1IxX6aPBSxRdcBeLCwcbbz7CjUFA`](https://walruscan.com/mainnet/blob/vPVfOyZZd8U7MUW1IxX6aPBSxRdcBeLCwcbbz7CjUFA)
* **Summary**: Client's exported video was blurry due to the export preset being set to 720p instead of 1080p. Changing the preset to 1080p resolved the issue.

---

## 4. Verification Method

To independently verify the blob counts and records above from the codebase:

```bash
# Query memory health and wallet object on Sui Mainnet
npm start
curl http://localhost:8787/api/health
```

Or execute direct recovery via `memwal_restore` in Node.js:
```javascript
import { MemWal } from './server/memwal.js';
const memwal = new MemWal({ spec: '@mysten-incubation/memwal-mcp@0.0.7', namespace: 'support' });
await memwal.connect();

// Re-indexes and reports total blob count per namespace
console.log(await memwal.call('memwal_restore', { namespace: 'support', limit: 100 }));
console.log(await memwal.call('memwal_restore', { namespace: 'open-tickets', limit: 100 }));
console.log(await memwal.call('memwal_restore', { namespace: 'product-intel', limit: 100 }));
```
