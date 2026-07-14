# 📚 Contextual Timeline

Contextual Timeline is a web tool that lets you explore books, historical events, and notable people side‑by‑side on a single, interactive time‑based map.

Built with the [vis.js library](https://visjs.org/), it provides a bird’s‑eye view of cultural and historical context, making it easy to see what happened when and together.

[🔗 Live Demo](https://kostaco.github.io/contextual-timeline/)

![Demo image](images/demo.png)

## ✨ Features

*   **Multi‑group timeline** – Books, history, and people are shown in separate horizontal tracks.
*   **Era backgrounds** – Coloured bands (e.g. Stari vek, Srednji vek) provide historical context.
*   **Smart clustering** – When too many items overlap in a group, they are automatically packed into +X bubbles to keep the view clean.
*   **Click to zoom** – Click any book, event, person, era, or cluster to zoom in smoothly.
*   **Sticky era labels** – Era names stay pinned at the top of the viewport as you scroll.
*   **“Show All Data”** – One‑click reset to the full timeline view.
*   **Works with BC/BCE dates** – Fully supports dates before year 0.

## 🚀 How to Use

| Action | Result |
| :--- | :--- |
| **Scroll** (mouse wheel or trackpad) | Zooms in/out on the timeline |
| **Drag** (click and drag) | Pans left/right through time |
| **Click any item** | Zooms to that item’s date range |
| **Click an era label** | Zooms to that entire historical period |
| **Click a cluster bubble (+N)** | Zooms to reveal all hidden items in that cluster |
| **Click “Show All Data”** | Resets to show the entire timeline |

## 📁 Project Structure

```text
contextual-timeline/
├── index.html          # Main HTML file
├── style.css           # All styles (timeline, groups, clusters, etc.)
├── data.js             # Your data: books, eras, events, people, groups
├── script.js           # Timeline logic (clustering, zooming, labels)
├── images/             # (optional) Demo image, icon, etc.
└── README.md           # This file
