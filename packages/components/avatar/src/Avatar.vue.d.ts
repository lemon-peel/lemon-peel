declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    size: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    shape: {
        type: StringConstructor;
        values: string[];
        default: string;
    };
    icon: {
        type: import("vue").PropType<string | import("vue").Component>;
    };
    src: {
        type: StringConstructor;
        default: string;
    };
    alt: {
        type: StringConstructor;
        default: string;
    };
    srcSet: StringConstructor;
    fit: {
        type: import("vue").PropType<import("csstype").ObjectFitProperty>;
        default: string;
    };
}, {
    hasLoadError: import("vue").Ref<boolean>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    error: (evt: Event) => boolean;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    size: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    shape: {
        type: StringConstructor;
        values: string[];
        default: string;
    };
    icon: {
        type: import("vue").PropType<string | import("vue").Component>;
    };
    src: {
        type: StringConstructor;
        default: string;
    };
    alt: {
        type: StringConstructor;
        default: string;
    };
    srcSet: StringConstructor;
    fit: {
        type: import("vue").PropType<import("csstype").ObjectFitProperty>;
        default: string;
    };
}>> & {
    onError?: (evt: Event) => any;
}, {
    size: string | number;
    alt: string;
    shape: string;
    src: string;
    fit: import("csstype").ObjectFitProperty;
}, {}>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
