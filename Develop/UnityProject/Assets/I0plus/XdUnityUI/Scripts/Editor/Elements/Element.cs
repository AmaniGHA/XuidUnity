﻿using System;
using System.Collections.Generic;
using JetBrains.Annotations;
using UnityEngine;

namespace I0plus.XdUnityUI.Editor
{
    /// <summary>
    ///     Element class.
    ///     based on Baum2.Editor.Element class.
    /// </summary>
    public abstract class Element
    {
        protected readonly string Layer;
        protected readonly Dictionary<string, object> LayoutElementJson;
        protected readonly List<object> ParsedNames;

        protected readonly Dictionary<string, object> RectTransformJson;
        protected bool? Active;

        protected string name;
        protected Element Parent;

        protected Element(Dictionary<string, object> json, Element parent)
        {
            Parent = parent;
            name = json.Get("name");
            //Debug.Log($"parsing {name}");
            Active = json.GetBool("active");
            Layer = json.Get("layer");
            ParsedNames = json.Get<List<object>>("parsed_names");

            RectTransformJson = json.GetDic("rect_transform");
            LayoutElementJson = json.GetDic("layout_element");
        }

        public string Name => name;

        public abstract void Render(RenderContext renderContext, ref GameObject targetObject, GameObject parentObject);

        public virtual void RenderPass2(List<Tuple<GameObject, Element>> selfAndSiblings)
        {
        }

        public bool HasParsedName(string parsedName)
        {
            if (ParsedNames == null || ParsedNames.Count == 0) return false;
            var found = ParsedNames.Find(s => (string) s == parsedName);
            return found != null;
        }

        /*
        protected void CreateUiGameObject(RenderContext renderContext, [CanBeNull] ref GameObject selfObject, GameObject parentObject)
        {
            selfObject = new GameObject(name);
            selfObject.AddComponent<RectTransform>();
            ElementUtil.SetLayer(selfObject, Layer);
            if (Active != null) selfObject.SetActive(Active.Value);
        }
        */

        /// <summary>
        ///     Objectの生成か再利用　親子関係の設定、Layer、Activeの設定
        /// </summary>
        /// <param name="renderContext"></param>
        /// <param name="selfObject"></param>
        /// <param name="parentObject"></param>
        /// <returns></returns>
        protected void GetOrCreateSelfObject(RenderContext renderContext, ref GameObject selfObject,
            GameObject parentObject)
        {
            // 指定のオブジェクトがある場合は生成・取得せずそのまま使用する
            if (selfObject == null)
            {
                selfObject = renderContext.OccupyObject( name, parentObject);
                if (selfObject != null)
                {
                }
                else
                {
                    // 再利用できなかった新規に作成
                    Debug.Log($"新規にGameObjectを生成しました:{name}");
                    selfObject = new GameObject(name);
                }
            }

            var rect = GetOrAddComponent<RectTransform>(selfObject);
            if (parentObject)
                //親のパラメータがある場合､親にする 後のAnchor定義のため
                rect.SetParent(parentObject.transform);
            
            ElementUtil.SetActive(selfObject, Active);
            ElementUtil.SetLayer(selfObject, Layer);
        }


        //since we do not want to read components to a prefab we use this method to add components to elements
        public static T GetOrAddComponent<T>(GameObject go) where T : Component
        {
            var comp = go.GetComponent<T>();
            if (comp != null) return comp;
            return go.AddComponent<T>();
        }
    }
}