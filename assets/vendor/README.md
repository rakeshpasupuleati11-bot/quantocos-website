# Vendored libraries

Pinned, self-hosted, no package manager. Each file was fetched from jsDelivr for an exact
npm version and hashed on arrival. Update only by re-downloading at a new pinned version and
replacing the hash below.

| File | Package | Version | Licence |
|---|---|---|---|
| `lenis.min.js` | `lenis` | 1.3.28 | MIT |
| `gsap.min.js` | `gsap` | 3.15.1 | GreenSock standard (no charge) |
| `ScrollTrigger.min.js` | `gsap` | 3.15.1 | GreenSock standard (no charge) |
| `three.module.min.js` | `three` | 0.187.0 | MIT — **vendored, not wired** |
| `barba.umd.js` | `@barba/core` | 2.10.3 | MIT — **vendored, not wired** |

Source pattern: `https://cdn.jsdelivr.net/npm/<package>@<version>/<path>`

```
d64110367eb45375dc5f21cb4915d224a22e74d7e73ca8a82cde710c3f0e3774  barba.umd.js
3d1bea374ab1b703cc5c4105358eec63c4465efdc573931dc116e34a0a190c1b  gsap.min.js
cf441c9cde2af021e1eea17f5a896fa133b2d91e73391401002826fb31cff11b  lenis.min.js
b5bb360661f478f0ff6ffa11500d8ce5e2b6aaf6f7288237cdca3aac9548035a  ScrollTrigger.min.js
49bfc58c4097915b4fcf08ed1ee245c0da687f02d35908f38266dbd3d5324ac2  three.module.min.js
```

`three` and `barba` are present so a later phase does not need a network fetch, but they are
not referenced by any page: a script tag alone adds weight and no behaviour. Wiring them means
writing the glass shader / the page transition layer, which is a separate change.
