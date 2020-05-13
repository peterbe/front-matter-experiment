# front-matter-experiment

Exploring techniques for parsing `index.html` + `index.yaml` versus.
putting the Yaml into the `index.html`.

## To dev

You need a clone of [github.com/mdn/yari](https://github.com/mdn/yari).
Then run something like this:

    cp -r ~/yari/content/files/en-us content-split
    cp -r ~/yari/content/files/en-us content-combined
    python prep.py

Now run:

    node run.js
