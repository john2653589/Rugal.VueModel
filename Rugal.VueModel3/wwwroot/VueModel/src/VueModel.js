﻿/**
 *  VueModel.js v3.2.1
 *  From Rugal Tu
 * */

VerifyVueJs();

const { createApp } = Vue;
const Dom = new DomEditor();
class VueModel extends CommonFunc {
    constructor() {
        super();
        this._Store = {
            FileStore: {},
        };
        this.ApiStore = {}
        this.VueOption = {
            methods: {},
            components: {},
            watch: {},
        };
        this.VueProxy = null;
        this.Vue = null;
        this.VueUse = [];

        this.BindElementId = 'BindApp';
        this.DefaultStoreKey = 'Default';
        this.WithDefaultStore(this.DefaultStoreKey);

        this.IsInited = false;

        this.GetToken = null;

        this.FuncKey_FormatDate = 'Format_Date';
        this._Domain = null;
        this._Token = null;

        this._Func_ConvertTo_FormParam = [];
        this._Funcs_Mounted = [];

        this.FileExtensionCheckOption = {
            IsCheck: false,
            IsAlert: false,
            ErrorMessage: 'Error file extension',
        };
    }

    //#region Property
    get Function() {
        let Result = this.VueProxy?.$options?.methods ?? this.VueOption.methods;
        return Result;
    }
    get Dom() {
        return new DomEditor();
    }
    get Domain() {
        if (this._Domain == null)
            return null;
        return this._GetClearDomain(this._Domain);
    }
    set Domain(_Domain) {
        this._Domain = this._GetClearDomain(_Domain);
    }
    get FileStore() {
        return this.Store.FileStore;
    }
    get Store() {
        let GetStore = this.VueProxy?.$data;
        GetStore ??= this._Store;
        return GetStore;
    }
    //#endregion

    //#region Init
    Init() {
        if (!this.IsInited) {
            let GetStore = this._Store;
            let MountedFunc = this._Funcs_Mounted;
            let SetVueOption = {
                ...this.VueOption,
                data() {
                    return GetStore;
                },
                mounted: () => {
                    for (let Func of MountedFunc)
                        Func();
                }
            };
            this.Vue = createApp(SetVueOption);
            for (let Item of this.VueUse) {
                this.Vue.use(Item);
            }
            this.VueProxy = this.Vue.mount(`#${this.BindElementId}`);
            this.IsInited = true;
        }
        return this;
    }
    WithDefaultStore(_DefaultStoreKey) {
        this.DefaultStoreKey = _DefaultStoreKey;
        this.Store[this.DefaultStoreKey] ??= {};
        return this;
    }
    WithStoreData(_StoreData) {
        this.Store = _StoreData;
        return this;
    }
    WithRootId(_BindElementId = 'BindApp') {
        this.BindElementId = _BindElementId;
        return this;
    }
    WithVueOption(_VueOption = {}) {
        this.VueOption = this._DeepObjectExtend(this.VueOption, _VueOption);
        return this;
    }
    WithComponent(Component = {}) {
        this.VueOption.components = this._DeepObjectExtend(this.VueOption.components, Component);
        return this;
    }
    WithMounted(MountedFunc = () => { }) {
        this._Funcs_Mounted.push(MountedFunc);
        return this;
    }
    WithDomain(_Domain) {
        this.Domain = _Domain;
        return this;
    }
    WithToken(_Token) {
        this._Token = _Token;
        return this;
    }
    WithConvertTo_FormParam(ConvertToFunc = (FormParam, Form) => { }) {
        this._Func_ConvertTo_FormParam.push(ConvertToFunc);
        return this;
    }
    WithJsonFormParam(JsonKey = 'Result') {
        this.WithConvertTo_FormParam((FormParam, Form) => {
            let ConvertParam = {};
            ConvertParam[JsonKey] = JSON.stringify(FormParam);
            return ConvertParam;
        });
        return this;
    }
    WithFileExtensionCheck(Option = { IsAlert: false, ErrorMessage: null }) {
        this.FileExtensionCheckOption.IsCheck = true;
        this.FileExtensionCheckOption.IsAlert = Option.IsAlert;
        if (!this._IsNullOrEmpty(Option.ErrorMessage))
            this.FileExtensionCheckOption.ErrorMessage = Option.ErrorMessage;
        return this;
    }
    WithVueUse(...UsePackage) {
        for (let Item of UsePackage) {
            this.VueUse.push(Item);
        }
        return this;
    }
    Using(UseFunc = () => { }) {
        UseFunc();
        return this;
    }
    //#endregion

    //#region Add Vue Command

    //#region Text
    AddV_Text(DomId, StoreKey = null) {
        this.AddVdom_Text(this.Dom.WithId(DomId), StoreKey ?? DomId);
        return this;
    }
    AddVq_Text(QueryString, StoreKey = null) {
        this.AddVdom_Text(this.Dom.WithCustom(QueryString), StoreKey);
        return this;
    }
    AddVcol_Text(ColName, StoreKey = null) {
        this.AddVdom_Text(this.Dom.WithAttr('vc-col', ColName), StoreKey ?? ColName);
        return this;
    }
    AddVdom_Text(Dom, StoreKey) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        StoreKey = this._ReCombineStoreKey(StoreKey);
        this.AddStore(StoreKey, null);
        GetDom.SetAttr('v-text', StoreKey);
        return this;
    }
    //#endregion

    //#region Input
    AddV_Input(DomId, StoreKey = null, Option = { VModelKey: null, IsReCombineStore: true }) {
        this.AddVdom_Input(
            this.Dom.WithId(DomId),
            StoreKey ?? DomId,
            Option
        );
        return this;
    }
    AddVq_Input(QueryString, StoreKey = null, Option = { VModelKey: null, IsReCombineStore: true }) {
        this.AddVdom_Input(
            this.Dom.WithCustom(QueryString),
            StoreKey,
            Option
        );
        return this;
    }
    AddVcol_Input(ColName, StoreKey = null, Option = { VModelKey: null, IsReCombineStore: true }) {
        this.AddVdom_Input(
            this.Dom.WithAttr('vc-col', ColName),
            StoreKey ?? ColName,
            Option
        );
        return this;
    }
    AddVdom_Input(Dom, StoreKey, Option = { VModelKey: null, IsReCombineStore: true }) {
        let GetDom = this._BaseCheck_DomEditor(Dom);

        if (Option.IsReCombineStore)
            StoreKey = this._ReCombineStoreKey(StoreKey);

        this.AddStore(StoreKey, null);
        GetDom.ForEach(Item => {
            let VModelCommand = 'v-model';
            if (!this._IsNullOrEmpty(Option.VModelKey))
                VModelCommand += `:${Option.VModelKey}`

            switch (Item.type) {
                case 'datetime':
                case 'datetime-local':
                case 'date':
                    this.AddVdom_Format(GetDom, this.FuncKey_FormatDate, StoreKey, `'${StoreKey}'`);
                    break;
                case 'number':
                    VModelCommand = 'v-model.number';
                    break;
            }
            GetDom.SetElement_Attr(Item, VModelCommand, StoreKey);
        });
        return this;
    }
    //#endregion

    //#region Select
    AddV_Select(Option = {
        SelectId: null,
        From: null,
        To: null,
        OptionId: null,
        Display: null,
        Value: null,
        Default: null,
    }) {
        let SelectQuery = this.Dom._QueryString_Id(Option.SelectId);
        let OptionQuery = this.Dom._QueryString_Id(Option.OptionId);

        this.AddVq_Select({
            SelectQuery,
            OptionQuery,
            From: Option.From,
            To: Option.To,
            Display: Option.Display,
            Value: Option.Value,
        });
        return this;
    }
    AddVcol_Select(Option = {
        SelectCol: null,
        OptionCol: null,
        From: null,
        To: null,
        Display: null,
        Value: null,
        Default: null,
    }) {
        Option.From = Option.From ?? Option.SelectCol;
        Option.To = Option.To ?? Option.SelectCol;

        let SelectQuery = this.Dom._QueryString_VcCol(Option.SelectCol);
        let OptionQuery = this.Dom._QueryString_VcCol(Option.OptionCol);
        this.AddVq_Select({
            SelectQuery,
            OptionQuery,
            From: Option.From,
            To: Option.To,
            Display: Option.Display,
            Value: Option.Value,
        });
        return this;
    }
    AddVq_Select(Option = {
        SelectQuery: null,
        From: null,
        To: null,
        OptionQuery: null,
        Display: null,
        Value: null,
        Default: null,
    }) {
        this.AddStore(this._ReCombineStoreKey(Option.To), Option.Default);
        this.UpdateStore([], Option.From, true);
        this.Dom
            .WithCustom(Option.SelectQuery)
            .ForEach(Item => {
                if (Option.From.toLowerCase() != '-html') {
                    let Display = this._ReCombineItemKey(Option.Display);
                    let Value = this._ReCombineItemKey(Option.Value);

                    this.Dom.NewWithElement([...Item.children])
                        .WhereCustom(Option.OptionQuery)
                        .SetAttr('v-text', Display)
                        .SetAttr(':value', Value)
                        .SetAttr('v-for', `(Item, Idx) in ${Option.From}`);
                }
                let StoreKey = this._ReCombineStoreKey(Option.To);
                this.Dom.SetElement_Attr(Item, 'v-model', StoreKey);
            })
        return this;
    }
    //#endregion

    //#region Select Html
    AddV_SelectHtml(SelectId, To) {
        this.AddVdom_SelectHtml(this.Dom.WithId(SelectId), To ?? SelectId);
        return this;
    }
    AddVq_SelectHtml(QueryString, To) {
        this.AddVdom_SelectHtml(this.Dom.WithCustom(QueryString), To);
        return this;
    }
    AddVdom_SelectHtml(Dom, To) {
        To = this._ReCombineStoreKey(To);
        this.AddStore(To, null);
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-model', To);
        return this;
    }
    //#endregion

    //#region Checkbox
    AddV_Checkbox(DomId, StoreKey = null, Option = {
        Value: null,
        Multi: false,
        IsChecked: false,
    }) {
        this.AddVdom_Checkbox(
            this.Dom.WithId(DomId),
            StoreKey ?? DomId,
            Option
        );
        return this;
    }
    AddVq_Checkbox(QueryString, StoreKey = null, Option = {
        Value: null,
        Multi: false,
        IsChecked: false,
    }) {
        this.AddVdom_Checkbox(
            this.Dom.WithCustom(QueryString),
            StoreKey,
            Option
        );
        return this;
    }
    AddVcol_Checkbox(ColName, StoreKey = null, Option = {
        Value: null,
        Multi: false,
        IsChecked: false,
    }) {
        this.AddVdom_Checkbox(
            this.Dom.WithAttr('vc-col', ColName),
            StoreKey ?? ColName,
            Option
        );
        return this;
    }
    AddVdom_Checkbox(Dom, StoreKey, Option = {
        Value: null,
        Multi: false,
        IsChecked: false,
    }) {
        let GetDom = this._BaseCheck_DomEditor(Dom);

        let DefaultValue = Option.Multi ? [] : Option.IsChecked;
        this.AddStore(StoreKey, DefaultValue);
        this.AddVdom_Input(Dom, StoreKey, {
            IsReCombineStore: false,
        });

        let BindValue = Option.Value;
        if (Option.Multi) {
            GetDom.ForEach(Item => {

                if (BindValue == null) {
                    let IsHtmlEmpty = Item.value == 'on' || this._IsNullOrEmpty(Item.value);
                    if (IsHtmlEmpty)
                        BindValue = `"${Item.getAttribute('vc-col')}"`;
                }

                this.AddVdom_Bind(new DomEditor(Item), 'value', BindValue);

                if (Option.IsChecked) {
                    let GetStore = this.Store[StoreKey];
                    let AddValue = BindValue
                        .replaceAll('"', '')
                        .replaceAll("'", '');

                    if (!GetStore.includes(AddValue))
                        GetStore.push(AddValue);
                }
            });

        }
        else if (BindValue != null)
            this.AddVdom_Bind(GetDom, 'value', BindValue);

        return this;
    }
    //#endregion

    //#region for-checkbox
    //'m:for-checkbox; f:Datas; of:MyDiv; To:ChkResult; val:Id; dis:Name; lbl:MySpan',
    AddVfor_Checkbox(Option = {
        Checkbox: null,
        From: null,
        To: null,
        Value: null,
        Display: null,
        Of: null,
        Label: null,
    }) {
        let Display = this._ReCombineItemKey(Option.Display);
        let Value = this._ReCombineItemKey(Option.Value);

        this.AddVcol_Checkbox(Option.Checkbox, Option.To, {
            Value: Value,
            Multi: true,
        });
        this.AddVcol_For(Option.Of, Option.From);
        this.AddVcol_Text(Option.Label, Display);
        return this;
    }

    //#endregion

    //#region For
    AddV_For(DomId, StoreKey, ForKey = null) {
        this.AddVdom_For(
            this.Dom.WithId(DomId),
            StoreKey ?? DomId,
            ForKey
        );
        return this;
    }
    AddVq_For(QueryString, StoreKey, ForKey = null) {
        this.AddVdom_For(
            this.Dom.WithCustom(QueryString),
            StoreKey,
            ForKey
        );
        return this;
    }
    AddVcol_For(ColName, StoreKey, ForKey = null) {
        this.AddVdom_For(
            this.Dom.WithAttr('vc-col', ColName),
            StoreKey,
            ForKey
        );
        return this;
    }
    AddVdom_For(Dom, StoreKey, ForKey = null) {
        let GetStore = this._RCS_GetStore(StoreKey, this.Store);
        if (GetStore == null)
            this.AddStore(StoreKey, []);
        else if (!Array.isArray(GetStore))
            this.UpdateStore([], StoreKey, true);

        ForKey ??= '(Item, Idx)';
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-for', `${ForKey} in ${StoreKey}`);
        return this;
    }
    //#endregion

    //#region Input-File
    AddV_File(DomId, FileStoreKey = null, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddVdom_File(this.Dom.WithId(DomId), FileStoreKey ?? DomId, Option);
        return this;
    }
    AddVq_File(QueryString, FileStoreKey = null, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddVdom_File(this.Dom.WithCustom(QueryString), FileStoreKey, Option);
        return this;
    }
    AddVcol_File(ColName, FileStoreKey = null, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddVdom_File(this.Dom.WithAttr('vc-col', ColName), FileStoreKey ?? ColName, Option);
        return this;
    }
    AddVdom_File(Dom, FileStoreKey, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddFileStore(FileStoreKey);
        let { IsAddMode, ConverFileFunc } = Option;

        this.AddVdom_OnChange(Dom, Arg => {
            if (this.FileExtensionCheckOption.IsCheck)
                this._CheckFileExtension(Arg);

            if (!IsAddMode)
                this.FileStore[FileStoreKey] = [];
            else
                Arg.target.value = '';

            let Files = [...Arg.target.files];
            let AddFiles = Files.map(Item => {

                let ConvertFile = {
                    FileId: this._GenerateId(),
                    File: Item,
                };
                if (ConverFileFunc != null)
                    ConverFileFunc(Item, ConvertFile);

                return ConvertFile;
            });

            this.FileStore[FileStoreKey].push(...AddFiles);
            this._UpdateVueStore();
        });
        return this;
    }
    //#endregion

    //#region If Render
    AddVcol_If(ColName, IfValue) {
        this.AddVdom_If(this.Dom.WithAttr('vc-col', ColName), IfValue);
        return this;
    }
    AddVdom_If(Dom, IfValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-if', IfValue);
        return this;
    }
    //#endregion

    //#region Show Render
    AddVcol_Show(ColName, ShowValue) {
        this.AddVdom_Show(this.Dom.WithAttr('vc-col', ColName), ShowValue);
        return this;
    }
    AddVdom_Show(Dom, ShowValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-show', ShowValue);
        return this;
    }
    //#endregion

    //#region Vue Option Set
    AddV_Function(FuncKey, Func) {
        this.VueOption.methods[FuncKey] = Func;
        return this;
    }

    AddV_Watch(WatchPath, Func, Deep = false, Option = {}) {
        let SetWatch = {
            handler: Func,
            deep: Deep,
            ...Option,
        };
        this.VueOption.watch[WatchPath] = SetWatch;
        return this;
    }
    //#endregion

    //#region Add Format
    AddV_Format(DomId, FuncKey, ...Params) {
        this.AddVdom_Format(this.Dom.WithId(DomId), FuncKey, Params ?? DomId);
        return this;
    }
    AddVq_Format(QueryString, FuncKey, ...Params) {
        this.AddVdom_Format(this.Dom.WithCustom(QueryString), FuncKey, Params);
        return this;
    }
    AddVdom_Format(_Dom, FuncKey, ...Params) {
        Params = Params.join(',');
        let GetDom = this._BaseCheck_DomEditor(_Dom);
        GetDom.SetAttr(':formatter', `${FuncKey}(${Params})`);
        return this;
    }
    //#endregion

    //#region Base Format Function
    AddBase_Format_Date() {
        this.AddV_Function(this.FuncKey_FormatDate, (DateValue, StoreKey) => {
            let SetValue = DateValue;
            if (DateValue != undefined) {
                SetValue = DateValue.replaceAll('/', '-').replaceAll('T', ' ');
            }
            if (DateValue != SetValue)
                this.UpdateStore(SetValue, StoreKey);
        })
        return this;
    }
    //#endregion

    //#region On Change Event
    AddV_OnChange(DomId, ChangeFunc, FuncParam = null) {
        this.AddVdom_OnChange(this.Dom.WithId(DomId), ChangeFunc, FuncParam);
        return this;
    }
    AddVq_OnChange(QueryString, ChangeFunc, FuncParam = null) {
        this.AddVdom_OnChange(this.Dom.WithCustom(QueryString), ChangeFunc, FuncParam);
        return this;
    }
    AddVcol_OnChange(ColName, ChangeFunc, FuncParam = null) {
        this.AddVdom_OnChange(this.Dom.WithAttr('vc-col', ColName), ChangeFunc, FuncParam);
        return this;
    }
    AddVdom_OnChange(Dom, ChangeFunc, FuncParam = null) {
        this.AddVdom_On(Dom, 'change', ChangeFunc, FuncParam);
        return this;
    }
    //#endregion

    //#region On Evnet
    AddV_On(DomId, EventKey, EventFunc, FuncParam = null) {
        this.AddVdom_On(this.Dom.WithId(DomId), EventKey, EventFunc, FuncParam);
        return this;
    }
    AddVq_On(QueryString, EventKey, EventFunc, FuncParam = null) {
        this.AddVdom_On(this.Dom.WithCustom(QueryString), EventKey, EventFunc, FuncParam);
        return this;
    }
    AddVcol_On(ColName, EventKey, EventFunc, FuncParam = null) {
        this.AddVdom_On(this.Dom.WithAttr('vc-col', ColName), EventKey, EventFunc, FuncParam);
        return this;
    }
    AddVdom_On(Dom, EventKey, EventFunc, FuncParam = null) {
        if (EventFunc == null)
            this._Throw(`Event「${EventKey}」function cannot be null`);

        let GetDom = this._BaseCheck_DomEditor(Dom);

        let FuncName = this._GetRandomFuncName(EventKey)
        this.AddV_Function(FuncName, EventFunc);

        let SetFuncKey = FuncName;
        if (FuncParam != null)
            SetFuncKey = `${SetFuncKey}(${FuncParam})`;

        GetDom.SetAttr(`v-on:${EventKey}`, SetFuncKey);
        return this;
    }
    //#endregion

    //#region Bind
    AddV_Bind(DomId, BindKey, BindValue) {
        this.AddVdom_Bind(this.Dom.WithId(DomId), BindKey, BindValue);
        return this;
    }
    AddVcol_Bind(ColName, BindKey, BindValue) {
        this.AddVdom_Bind(this.Dom.WithAttr('vc-col', ColName), BindKey, BindValue);
        return this;
    }
    AddVq_Bind(QueryString, BindKey, BindValue) {
        this.AddVdom_Bind(this.Dom.WithCustom(QueryString), BindKey, BindValue);
        return this;
    }
    AddVdom_Bind(Dom, BindKey, BindValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr(`v-bind:${BindKey}`, BindValue);
        return this;
    }
    //#endregion

    //#region Click
    AddV_Click(DomId, ClickFunc, FuncParam = null) {
        this.AddVdom_Click(this.Dom.WithId(DomId), ClickFunc, FuncParam);
        return this;
    }
    AddVq_Click(QueryString, ClickFunc, FuncParam = null) {
        this.AddVdom_Click(this.Dom.WithCustom(QueryString), ClickFunc, FuncParam);
        return this;
    }
    AddVcol_Click(ColName, ClickFunc, FuncParam = null) {
        this.AddVdom_Click(this.Dom.WithAttr('vc-col', ColName), ClickFunc, FuncParam);
        return this;
    }
    AddVdom_Click(Dom, ClickFunc, FuncParam = null) {
        if (ClickFunc == null)
            this._Throw('Click function cannot be null');

        let GetDom = this._BaseCheck_DomEditor(Dom);

        let FuncName = ClickFunc;
        if (typeof ClickFunc === 'function') {
            FuncName = this._GetRandomFuncName('Func');
            this.AddV_Function(FuncName, ClickFunc);
        }

        let SetFuncKey = FuncName;
        if (FuncParam != null)
            SetFuncKey = `${SetFuncKey}(${FuncParam})`;

        GetDom.SetAttr(`v-on:click`, SetFuncKey);
        return this;
    }
    //#endregion

    //#region Slot
    AddV_Slot(DomId, SlotKey, SlotValue) {
        this.AddVdom_Slot(this.Dom.WithId(DomId), SlotKey, SlotValue);
        return this;
    }
    AddVcol_Slot(ColName, SlotKey, SlotValue) {
        this.AddVdom_Slot(this.Dom.WithAttr('vc-col', ColName), SlotKey, SlotValue);
        return this;
    }
    AddVq_Slot(QueryString, SlotKey, SlotValue) {
        this.AddVdom_Slot(this.Dom.WithCustom(QueryString), SlotKey, SlotValue);
        return this;
    }
    AddVdom_Slot(Dom, SlotKey, SlotValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr(`v-slot:${SlotKey}`, SlotValue);
        return this;
    }
    //#endregion


    //#region Add Base Vue Command
    AddVdom_Model(Dom, StoreKey, Option = { VModelKey: null }) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        StoreKey = this._ReCombineStoreKey(StoreKey);
        this.AddStore(StoreKey, null);
        GetDom.ForEach(Item => {
            let VModelCommand = 'v-model';
            if (!this._IsNullOrEmpty(Option.VModelKey))
                VModelCommand += `:${Option.VModelKey}`;

            switch (Item.type) {
                case 'datetime':
                case 'datetime-local':
                case 'date':
                    this.AddVdom_Format(GetDom, this.FuncKey_FormatDate, StoreKey, `'${StoreKey}'`);
                    break;
                case 'number':
                    VModelCommand = 'v-model.number';
                    break;
            }
            GetDom.SetElement_Attr(Item, VModelCommand, StoreKey);
        });
        return this;
    }
    //#endregion

    //#endregion

    //#region Attr Control
    SetAttr(DomId, AttrName, AttrValue) {
        this.SetAttrDom(this.Dom.WithId(DomId), AttrName, AttrValue);
        return this;
    }

    SetAttrQ(QueryString, AttrName, AttrValue) {
        this.SetAttrDom(this.Dom.WithCustom(QueryString), AttrName, AttrValue);
        return this;
    }

    SetAttrCol(ColName, AttrName, AttrValue) {
        this.SetAttrDom(this.Dom.WithAttr('vc-col', ColName), AttrName, AttrValue);
        return this;
    }

    SetAttrDom(Dom, AttrName, AttrValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr(AttrName, AttrValue);
        return this;
    }
    //#endregion

    //#region Base Add Vue Command
    _BaseCheck_DomEditor(CheckDom) {
        if (CheckDom instanceof DomEditor) {
            return CheckDom;
        }
        throw new Error('error DomEditor type');
    }
    //#endregion

    //#region Store Data Controller
    UpdateStore(StoreData, StoreKey, IsReplace = false) {
        StoreKey = this._TryGetStoreKey(StoreKey);

        StoreData ??= {};

        StoreData = this._TryToJson(StoreData);

        this._RCS_SetStore(StoreKey, StoreData, this.Store, IsReplace);
        this._UpdateVueStore();
        return this;
    }
    AddStore(StoreKey, StoreData = {}) {
        if (this._RCS_GetStore(StoreKey, this.Store) != null)
            return this;

        this._RCS_SetStore(StoreKey, StoreData, this.Store, true);
        this._UpdateVueStore();
        return this;
    }
    AddFileStore(FileStoreKey) {
        if (this.FileStore[FileStoreKey] == null)
            this.FileStore[FileStoreKey] = [];
        return this;
    }
    Files(FileStoreKey, MapFunc = null) {
        let GetFiles = this.FileStore[FileStoreKey];
        if (GetFiles == null)
            return [];

        let MapFiles = MapFunc != null ?
            GetFiles.map(Item => MapFunc(Item)) :
            GetFiles.map(Item => Item['File']);

        return MapFiles;
    }

    _RCS_GetStore(StoreKey, FindStore) {
        if (FindStore == null)
            return null;

        if (!StoreKey.includes('.'))
            return FindStore[StoreKey];

        let FirstKey = StoreKey.split('.')[0];
        let NextKey = StoreKey.replaceAll(`${FirstKey}.`, '');
        return this._RCS_GetStore(NextKey, FindStore[FirstKey]);
    }
    _RCS_SetStore(StoreKey, StoreData, FindStore, IsReplace) {
        if (!StoreKey.includes('.')) {
            if (!(StoreKey in FindStore) || IsReplace) {
                this._BaseSetStoreObject(StoreData, StoreKey, FindStore);
            }
            else {
                let GetStore = FindStore[StoreKey];
                let SetStore = StoreData;

                if (typeof GetStore != 'object')
                    FindStore[StoreKey] = SetStore;
                else {
                    this._BaseSetStoreObject(StoreData, StoreKey, FindStore);
                }
            }
            return FindStore[StoreKey];
        }
        else {
            let FirstKey = StoreKey.split('.')[0];
            let NextKey = StoreKey.replaceAll(`${FirstKey}.`, '');
            if (FindStore[FirstKey] == null) {
                FindStore[FirstKey] = {};
            }
            return this._RCS_SetStore(NextKey, StoreData, FindStore[FirstKey], IsReplace);
        }
    }
    _BaseSetStoreObject(SetData, StoreKey, FindStore) {
        if (
            FindStore[StoreKey] == null ||
            typeof FindStore[StoreKey] == 'string' ||
            typeof SetData != 'object' ||
            Array.isArray(SetData)) {

            if (!Array.isArray(SetData))
                FindStore[StoreKey] = SetData;
            else {
                if (!Array.isArray(FindStore[StoreKey]))
                    FindStore[StoreKey] = [];

                if (FindStore[StoreKey].length > 0)
                    FindStore[StoreKey].splice(0, FindStore[StoreKey].length);
                FindStore[StoreKey].push(...SetData);
            }
        }
        else if (SetData == null) {
            FindStore[StoreKey] = SetData;
        }
        else {
            this._ForEachKeyValue(SetData, (Key, Value) => {
                FindStore[StoreKey][Key] = Value;
            });
        }
    }
    _UpdateVueStore() {
        this.VueProxy?.$forceUpdate();
    }
    //#endregion

    //#region Api Store Controller
    AddApi_Get(ApiKey, Option = {
        Url: null,
        Param: {
            Query: null,
        },
        OnCalling: null,
        OnSuccess: null,
        OnError: null,
        OnComplete: null,
    }) {
        Option.Method = 'GET';
        this._Add_Api(ApiKey, Option);
        return this;
    }

    AddApi_Post(ApiKey, Option = {
        Url: null,
        Param: {
            Query: null,
            Body: null,
            Form: null,
            File: null,
        },
        OnCalling: null,
        OnSuccess: null,
        OnError: null,
        OnComplete: null,
    }) {
        Option.Method = 'POST';
        this._Add_Api(ApiKey, Option);
        return this;
    }

    ApiCall(ApiKey, Option = {
        Param: {
            Query: null,
            Body: null
        },
        OnCalling: null, OnSuccess: null, OnComplete: null, OnError: null
    }) {

        let Api = this.ApiStore[ApiKey];
        if (Api == null)
            this._Throw(`Api setting not found of「${ApiKey}」`);

        let Query = Option?.Param?.Query;
        Query ??= Api.Param?.Query;
        let Url = this._ConvertTo_DomainUrl(Api.Url, Query);

        let SendBody = Option?.Param?.Body;
        SendBody ??= Api.Body;

        let FetchParam = {
            method: Api.Method,
            headers: {
                'content-type': 'application/json',
                'Authorization': this._Token,
            },
        };

        if (Api.Method.toUpperCase() == 'POST')
            FetchParam['body'] = JSON.stringify(SendBody ?? {})

        Api.OnCalling?.call(this, FetchParam);
        Option.OnCalling?.call(this, FetchParam);
        fetch(Url, FetchParam)
            .then(async ApiRet => {
                if (!ApiRet.ok)
                    throw ApiRet;

                let ConvertResult = await this._ProcessApiReturn(ApiRet);
                let StoreKey = Api['ApiKey'];
                this.UpdateStore(ConvertResult, StoreKey, true);

                Api.OnSuccess?.call(this, ConvertResult);
                Option?.OnSuccess?.call(this, ConvertResult);
                return ConvertResult;
            })
            .catch(async ex => {
                Api.OnError?.call(this, ex);
                Option?.OnError?.call(this, ex);
                this._Error(ex.message);
            })
            .then(async ConvertResult => {
                Api.OnComplete?.call(this, ConvertResult);
                Option?.OnComplete?.call(this, ConvertResult);
            });

        return this;
    }

    ApiCall_Form(ApiKey, Option = {
        Param: {
            Query: null,
            Form: null,
            File: null
        },
        OnCalling: null, OnSuccess: null, OnComplete: null, OnError: null
    }) {
        let Api = this.ApiStore[ApiKey];

        let Query = Option?.Param?.Query;
        Query ??= Api.Param?.Query;
        let Url = this._ConvertTo_DomainUrl(Api.Url, Query);

        let SendForm = null;

        let FormParam = Option?.Param?.Form;
        FormParam ??= Api.Param?.Form;
        SendForm = this._ConvertTo_FormParam(FormParam, SendForm);

        let FileParam = Option?.Param?.File;
        FileParam ??= Api.Param?.File;
        SendForm = this._ConvertTo_FormFile(FileParam, SendForm);

        let FetchParam = {
            method: 'POST',
            body: SendForm,
            headers: {
                'Authorization': this._Token,
            },
        };

        Api.OnCalling?.call(this, FetchParam);
        Option.OnCalling?.call(this, FetchParam);
        fetch(Url, FetchParam)
            .then(async ApiResult => {
                if (!ApiResult.ok)
                    throw ApiResult;

                let ConvertResult = await this._ProcessApiReturn(ApiResult);

                Api.OnSuccess?.call(this, ConvertResult);
                Option.OnSuccess?.call(this, ConvertResult);
                return ConvertResult;
            })
            .catch(async ex => {
                Api.OnError?.call(this, ex);
                Option.OnError?.call(this, ex);
            })
            .then(async ConvertResult => {
                Api.OnComplete?.call(this, ConvertResult);
                Option.OnComplete?.call(this, ConvertResult);
            });

        return this;
    }

    _Add_Api(ApiKey, Option = {
        Url,
        Param,
        Method,
        OnSuccess, OnError, OnComplete
    }) {
        let SetStore = {
            ApiKey,
            Url: Option.Url,
            Method: Option.Method,
            Param: Option.Param,
            OnSuccess: Option.OnSuccess,
            OnError: Option.OnError,
            OnComplete: Option.OnComplete,
        };
        this.ApiStore[ApiKey] = SetStore;
        this.AddStore(ApiKey);
        return SetStore;
    }
    _ProcessApiReturn(ApiRet) {
        let GetContentType = ApiRet.headers.get("content-type");
        let ConvertSuccess = null;
        if (GetContentType && GetContentType.includes('application/json')) {
            ConvertSuccess = ApiRet.json()
                .then(GetJson => GetJson);
        }
        else {
            ConvertSuccess = ApiRet.text()
                .then(GetText => GetText);
        }
        return ConvertSuccess;
    }
    _ConvertTo_DomainUrl(Url, Param = null) {
        let DomainUrl = this._GetClearUrl(Url);
        if (this.Domain != null && !DomainUrl.includes('http')) {
            DomainUrl = `${this.Domain}/${DomainUrl}`;
        }
        if (Param != null)
            DomainUrl = `${DomainUrl}?${this._ConvertTo_UrlQuery(Param)}`;

        return DomainUrl;
    }
    _ConvertTo_UrlQuery(Param) {
        if (typeof Param === 'string')
            return Param;

        let AllParam = [];
        this._ForEachKeyValue(Param, (Key, Value) => {
            AllParam.push(`${Key}=${Value}`);
        });

        let QueryString = AllParam.join('&');
        return QueryString;
    }
    _ConvertTo_FormParam(FormParam, Form = null) {

        if (FormParam == null)
            return Form;

        Form ??= new FormData();

        this._Func_ConvertTo_FormParam.forEach(Func => {
            FormParam = Func(FormParam, Form);
        });

        if (FormParam instanceof FormData)
            return FormParam;

        this._ForEachKeyValue(FormParam, (Key, Value) => {
            Form.append(Key, Value);
        });
        return Form;
    }
    _ConvertTo_FormFile(FileParam, Form = null) {
        if (FileParam == null)
            return Form;

        Form ??= new FormData();

        let DefaultKey = 'Files';
        if (Array.isArray(FileParam)) {
            FileParam.forEach(GetFile => {
                Form.append(DefaultKey, GetFile);
            });
        }
        else if (FileParam instanceof File) {
            Form.append(DefaultKey, FileParam);
        }
        else {
            this._ForEachKeyValue(FileParam, (Key, GetFile) => {
                if (Array.isArray(GetFile)) {
                    GetFile.forEach(File => {
                        Form.append(Key, File);
                    });
                }
                else
                    Form.append(Key, GetFile);
            });
        }
        return Form;
    }
    //#endregion



    //#region Base Process
    _BaseReCombine(FirstKey, Params) {
        if (!Array.isArray(Params))
            Params = [Params];

        let ParamArray = Params.filter(Item => !this._IsNullOrEmpty(Item));
        if (ParamArray.length == 0)
            this._Throw('Params cannot empty');

        if (ParamArray.length == 1) {
            let GetKey = ParamArray[0];
            if (this._IsClearSotreKey(GetKey))
                ParamArray = [FirstKey, ...ParamArray];
        }

        let BindStoreKey = ParamArray.join('.').replace(/^\.+|\.+$/g, '');
        return BindStoreKey;
    }
    _ReCombineStoreKey(Params) {
        let BindStoreKey = this._BaseReCombine(this.DefaultStoreKey, Params);
        return BindStoreKey;
    }
    _ReCombineItemKey(Params) {
        let BindStoreKey = this._BaseReCombine('Item', Params);
        return BindStoreKey;
    }
    _IsClearSotreKey(StoreKey) {
        let SkipChar = ['.', '(', ')'];
        let IsClear = SkipChar.filter(Item => StoreKey.includes(Item)).length == 0;
        return IsClear;
    }
    _TryToJson(Data) {
        if (typeof Data === 'object')
            return Data;
        else if (typeof Data != 'string')
            return Data;
        else {
            try {
                return JSON.parse(Data);
            }
            catch {
                return Data;
            }
        }
    }
    _TryGetStoreKey(_StoreKey) {
        _StoreKey ??= this.DefaultStoreKey;
        return _StoreKey;
    }
    _GetClearDomain(_Domain) {
        let ClearDomain = _Domain.replace(/\/+$/, '');
        return ClearDomain;
    }
    _GetClearUrl(_Url) {
        let ClearUrl = _Url.replace(/^\/+/, '');
        return ClearUrl;
    }
    _GetRandomFuncName(FuncNameHead = '', FuncNameTail = '') {
        let RandomFuncName = this._GenerateId().replaceAll('-', '');

        FuncNameHead = FuncNameHead.replaceAll('.', '');
        if (!this._IsNullOrEmpty(FuncNameHead))
            RandomFuncName = `${FuncNameHead}_${RandomFuncName}`;

        if (!this._IsNullOrEmpty(FuncNameTail))
            RandomFuncName = `${RandomFuncName}_${FuncNameTail}`;

        return RandomFuncName;
    }
    _CheckFileExtension(Arg) {
        let Input = Arg.target;
        let Files = [...Input.files];
        let FileAccept = Input.accept;
        if (this._IsNullOrEmpty(FileAccept))
            return;

        let AcceptArray = FileAccept
            .replaceAll(' ', '')
            .split(',')
            .map(Item => Item.toLowerCase().replaceAll('.', ''));

        let IsCheck = true;
        for (let i = 0; i < Files.length; i++) {
            let GetFile = Files[i];
            let FileName = GetFile.name;
            if (!FileName.includes('.')) {
                IsCheck = false;
                break;
            }

            let GetExtension = FileName
                .split('.')
                .pop()
                .toLowerCase();

            if (!AcceptArray.includes(GetExtension)) {
                IsCheck = false;
                break;
            }
        }

        if (!IsCheck) {
            Input.value = '';

            let ErroeMessage = this.FileExtensionCheckOption.ErrorMessage;
            if (this.FileExtensionCheckOption.IsAlert)
                alert(ErroeMessage);

            this._Throw(ErroeMessage);
        }
    }
    //#endregion
}
const Model = new VueModel()
    .AddBase_Format_Date();

function VerifyVueJs() {
    try {
        if (Vue);
    } catch (ex) {
        throw ('Vue.js is not found, should include Vue.js before include VueModel');
    }
}