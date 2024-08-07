﻿/**
 *  CommonFunc.js v1.2.0
 *  From Rugal Tu
 * */
class CommonFunc {
    constructor() {
        this.Id = this._GenerateId();
        this.NavigateToFunc = null;
    }

    WithNavigateToFunc(_NavigateToFunc) {
        this.NavigateToFunc = _NavigateToFunc;
        return this;
    }

    _HasAnyKeys(Obj) {
        let AllKey = Object.keys(Obj);
        let IsHas = AllKey.length > 0;
        return IsHas;
    }

    _ForEachKeyValue(Param, Func = (Key, Value) => { }) {
        let AllKey = Object.keys(Param);
        for (let i = 0; i < AllKey.length; i++) {
            let Key = AllKey[i];
            let Value = Param[Key];
            if (Func != null)
                Func.call(this, Key, Value);
        }
    }
    _IsNullOrEmpty(Text) {
        if (Text == null || Text == '')
            return true;
        return false;
    }
    _Throw(Message) {
        throw new Error(Message);
    }
    _Error(Message) {
        console.log(Message);
    }
    _GenerateId() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    _IsString(Data) { return typeof Data === 'string'; }

    _ReadImageBase64(Image, OnSuccess = Base64 => { }) {
        let Reader = new FileReader();
        Reader.onload = () => {
            let Base64Result = Reader.result;
            OnSuccess(Base64Result);
        };
        Reader.readAsDataURL(Image);
    }
    _Base64ToFile(Base64, FileName) {
        let Base64Array = Base64.split(',');
        let MimeType = Base64Array[0].match(/:(.*?);/)[1]
        let Buffer = atob(Base64Array[Base64Array.length - 1]);
        let Count = Buffer.length;
        let SetBuffer = new Uint8Array(Count);
        while (Count--)
            SetBuffer[Count] = Buffer.charCodeAt(Count);

        let ConvertFile = new File([SetBuffer], FileName, { type: MimeType });
        return ConvertFile;
    }

    _DeepObjectExtend(Target, Source, MaxDepth = 10) {
        if (MaxDepth == 0)
            return {
                ...Target,
                ...Source,
            };

        let AllKeys = Object.keys(Source);
        for (let i = 0; i < AllKeys.length; i++) {
            let Key = AllKeys[i];
            if (!(Key in Target))
                Target[Key] = Source[Key];
            else if (typeof Source[Key] != "object")
                Target[Key] = Source[Key];
            else {
                let NewObject = {
                    ...this._DeepObjectExtend(Target[Key], Source[Key], MaxDepth - 1),
                };
                Target[Key] = NewObject;
            }
        }
        return Target;
    }

    GetDate(QueryDate) {
        QueryDate ??= new Date();
        let Year = QueryDate.getFullYear();
        let Month = QueryDate.getMonth() + 1;
        let Day = QueryDate.getDate();

        let Result = {
            Year,
            Month,
            Day,
        };
        return Result;
    }
    GetTime(QueryDate) {
        QueryDate ??= new Date();
        let Hour = QueryDate.getHours();
        let Minute = QueryDate.getMinutes();
        let Second = QueryDate.getSeconds();

        let Result = {
            Hour,
            Minute,
            Second,
        };
        return Result;
    }
    GetDateTime(QueryDate) {
        QueryDate ??= new Date();
        let DateResult = this.GetDate(QueryDate);
        let TimeResult = this.GetTime(QueryDate);
        let Result = {
            ...DateResult,
            ...TimeResult,
        };
        return Result;
    }

    GetDateText(Option = {
        QueryDate: null,
        IsFillZero: true,
        Separator: '-',
    }) {
        let QueryDate = Option.QueryDate ?? new Date();
        let Result = this.ToDateText(QueryDate, Option);
        return Result;
    }
    GetTimeText(Option = {
        QueryDate: null,
        IsFillZero: true,
        Separator: ':',
    }) {
        let QueryDate = Option.QueryDate ?? new Date();
        let Result = this.ToTimeText(QueryDate, Option);
        return Result;
    }
    GetDateTimeText(Option = {
        QueryDate: null,
        IsFillZero: true,
        DateSeparator: '-',
        TimeSeparator: ':'
    }) {
        let QueryDate = Option.QueryDate ?? new Date();
        let Result = this.ToDateTimeText(QueryDate, Option);
        return Result;
    }

    ToDateText(QueryDate, Option = {
        IsFillZero: true,
        Separator: '-',
    }) {
        Option.IsFillZero ??= true;
        Option.Separator ??= '-';

        if (QueryDate instanceof Date)
            QueryDate = this.GetDate(QueryDate);

        let { Year, Month, Day } = QueryDate;

        if (Option.IsFillZero)
            Month = Month.toString().padStart(2, '0');

        if (Option.IsFillZero)
            Day = Day.toString().padStart(2, '0');

        let TextArray = [Year, Month, Day];
        let Result = TextArray.join(Option.Separator)
        return Result;
    }
    ToTimeText(QueryDate, Option = {
        IsFillZero: true,
        Separator: ':',
    }) {
        Option.IsFillZero ??= true;
        Option.Separator ??= ':';

        if (QueryDate instanceof Date)
            QueryDate = this.GetTime(QueryDate);

        let { Hour, Minute, Second } = QueryDate;

        Hour ??= 0;
        if (Option.IsFillZero)
            Hour = Hour.toString().padStart(2, '0');

        Minute ??= 0;
        if (Option.IsFillZero)
            Minute = Minute.toString().padStart(2, '0');

        Second ??= 0;
        if (Option.IsFillZero)
            Second = Second.toString().padStart(2, '0');

        let TextArray = [Hour, Minute, Second];
        let Result = TextArray.join(Option.Separator)
        return Result;
    }
    ToDateTimeText(QueryDate, Option = {
        IsFillZero: true,
        DateSeparator: '-',
        TimeSeparator: ':'
    }) {

        if (QueryDate instanceof Date)
            QueryDate = this.GetDateTime(QueryDate);

        let DateResult = this.ToDateText(QueryDate, Option);
        let TimeResult = this.ToTimeText(QueryDate, Option);
        let Result = `${DateResult} ${TimeResult}`;
        return Result;
    }

    _CompareSortBy(Key, IsDesc) {
        let Func = (ObjA, ObjB) => {
            let XNumber = IsDesc ? -1 : 1;
            if (ObjA[Key] < ObjB[Key])
                return -1 * XNumber;
            if (ObjA[Key] > ObjB[Key])
                return 1 * XNumber;
            return 0;
        }
        return Func;
    }

    //#region Web Page Controller
    NavigateTo(Url = [], UrlParam = null) {

        if (!Array.isArray(Url))
            Url = [Url];

        let IsAbsolute = Url[0][0] == '/';

        let CombineUrl = Url
            .map(Item => this._ClearUrl(Item))
            .join('/');

        if (IsAbsolute)
            CombineUrl = `/${CombineUrl}`;

        if (UrlParam != null) {
            if (typeof (UrlParam) != 'string')
                UrlParam = this._ConvertTo_UrlQuery(UrlParam);
            CombineUrl += `?${UrlParam}`;
        }

        if (this.NavigateToFunc)
            this.NavigateToFunc(CombineUrl);
        else
            window.location.href = CombineUrl;
    }
    _ClearUrl(_ApiUrl) {
        let ClearUrl = _ApiUrl.replace(/^\/+|\/+$/g, '');
        return ClearUrl;
    }
    //#endregion
}
function AddTaskLoop(TaskFunc, Delay = 1000) {
    let LoopId = setInterval(TaskFunc, Delay);
    return LoopId;
}