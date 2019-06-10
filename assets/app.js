ASSET_PATH_PATTERN = /^\/assets\/library\/(.*?)([^/]+?)(?:@(.*?))?\.(png|jpg|pdf)$/i;
ASSETS_BY_FOLDER = {};

function AssetVariation(modifer, extension, path) {
    this.modifier = modifer;
    this.extension = extension;
    this.path = path;
}
AssetVariation.prototype.toString = function() {
    return this.path;
};
AssetVariation.prototype.toURL = function() {
    var url = window.location.origin;
    if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
    }
    url += this.path;
    return url;
};

function Asset(name, folder, variations) {
    this.name = name;
    this.folder = folder;
    this.variations = variations || [];
}
Asset.prototype.addVariation = function(variation) {
    this.variations.push(variation);
};
Asset.prototype.toString = function() {
    return "[ Asset name='" + this.name + "' folder='" + this.folder + "']";
};

function registerImage(img) {

    var match = ASSET_PATH_PATTERN.exec(img);
    var folder = match[1] || '/';
    var name = match[2];
    var modifier = match[3] || null;
    var extension = match[4];

    var assets = ASSETS_BY_FOLDER[folder] || {};
    ASSETS_BY_FOLDER[folder] = assets;

    var asset = assets[name] || new Asset(name, folder);
    asset.addVariation(new AssetVariation(modifier, extension, img));

    assets[name] = asset;
}

function renderFolderListItem(folder) {
    document.write("<li>", folder, "</li>");
}

function renderFolderList() {
    document.write("<ul>");
    for (var folder in ASSETS_BY_FOLDER) {
        renderFolderListItem(folder);
    }
    document.write("</ul>");
}

function renderAsset(asset) {

    /*
   <li class="image">
       <div class="image-container">
           <img src="img/square.svg" />
           <div class="image-overlay">
               <a href="img/square.svg" class="icon-view"></a>
               <div class="download-group">
                   <button class="download-button">PNG</button>
                   <button class="download-button">PNG-2x</button>
                   <button class="download-button">PNG-3X</button>
                   <button class="download-button">SVG</button>
               </div>
           </div>
       </div>
       <h3>Square Image</h3>
   </li>
    */

    var li = '<li class="image">';
    li += '<div class="image-container">';
    li += '<img src="' + asset.variations[0].toURL() + '" />';
    li += '<div class="image-overlay">';
    li += '<a href="' + asset.variations[0].toURL() + '" class="icon-view" target="_blank"></a>';
    li += '<div class="download-group">';

    for (var i = 0; i < asset.variations.length; i++) {
        var variation = asset.variations[i];
        var label = variation.extension.toUpperCase();
        if (variation.modifier) {
            label += "-" + variation.modifier;
        }
        li += "<button class='download-button' onClick='window.open(\"" + variation.toURL() + "\")'>" + label + "</button>";
    }

    li += '</div>';
    li += '</div>';
    li += '</div>';
    li += '</li>';

    document.write(li);
}

function renderAssets(folder) {
    document.write("<h2>" + folder + "</h2>");
    document.write("<ul class='image-list'>");
    var assets = folder ? ASSETS_BY_FOLDER[folder] : [];
    for (var name in assets) {
        renderAsset(assets[name]);
    }
    document.write("</ul>");
}

function renderAllAssets() {

    document.write("<h2>All</h2>");
    document.write("<ul class='image-list'>");
    for (var folder in ASSETS_BY_FOLDER) {
        var assets = ASSETS_BY_FOLDER[folder];
        for (var name in assets) {
            renderAsset(assets[name]);
        }
    }

    document.write("</ul>");
}
