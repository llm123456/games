

async function main() {
    await RES.loadConfig("resource/default.res.json", "resource/");
    await RES.loadGroup("default");
    await RES.loadGroup("preload");

    egret.registerImplementation("eui.IAssetAdapter", new base.AssetAdapter());
    egret.registerImplementation("eui.IThemeAdapter", new base.ThemeAdapter());

    let scene = new game.LoadingScene();
    scene.Create();

}