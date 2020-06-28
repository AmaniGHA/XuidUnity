﻿using System;
using System.Linq;
using System.Reflection;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

#if TMP_PRESENT
using TMPro;
#endif

namespace XdUnityUI.Editor
{
    /// <summary>
    /// PrefabCreator class.
    /// based on Baum2.Editor.PrefabCreator class.
    /// </summary>
    public sealed class PrefabCreator
    {
        private static readonly string[] Versions = {"0.6.0", "0.6.1"};
        private readonly string spriteRootPath;
        private readonly string fontRootPath;
        private readonly string assetPath;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="spriteRootPath"></param>
        /// <param name="fontRootPath"></param>
        /// <param name="assetPath">フルパスでの指定 Unity Assetフォルダ外もよみこめる</param>
        public PrefabCreator(string spriteRootPath, string fontRootPath, string assetPath)
        {
            this.spriteRootPath = spriteRootPath;
            this.fontRootPath = fontRootPath;
            this.assetPath = assetPath;
        }

        public GameObject Create()
        {
            if (EditorApplication.isPlaying)
            {
                EditorApplication.isPlaying = false;
            }

            var text = System.IO.File.ReadAllText(assetPath);
            var json = Baum2.MiniJSON.Json.Deserialize(text) as Dictionary<string, object>;
            var info = json.GetDic("info");
            Validation(info);

            var renderer = new RenderContext(spriteRootPath, fontRootPath);
            var rootJson = json.GetDic("root");
            GameObject root = null;

            var rootElement = ElementFactory.Generate(rootJson, null);
            root = rootElement.Render(renderer, null);

            Postprocess(root);

            if (renderer.ToggleGroupMap.Count > 0)
            {
                // ToggleGroupが作成された場合
                var go = new GameObject("ToggleGroup");
                go.transform.SetParent(root.transform);
                foreach (var keyValuePair in renderer.ToggleGroupMap)
                {
                    var gameObject = keyValuePair.Value;
                    gameObject.transform.SetParent(go.transform);
                }
            }

            return root;
        }

        private void Postprocess(GameObject go)
        {
            var methods = Assembly
                .GetExecutingAssembly()
                .GetTypes()
                .Where(x => x.IsSubclassOf(typeof(BaumPostprocessor)))
                .Select(x => x.GetMethod("OnPostprocessPrefab"));
            foreach (var method in methods)
            {
                method.Invoke(null, new object[] {go});
            }
        }

        public void Validation(Dictionary<string, object> info)
        {
            var version = info.Get("version");
            if (!Versions.Contains(version))
                throw new Exception(string.Format("version {0} is not supported", version));
        }
    }
}