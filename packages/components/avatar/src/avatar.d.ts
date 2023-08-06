import type { ExtractPropTypes, PropType } from 'vue';
import type { ObjectFitProperty } from 'csstype';
import type Avatar from './Avatar.vue';
export declare const avatarProps: {
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
        type: PropType<string | import("vue").Component>;
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
        type: PropType<ObjectFitProperty>;
        default: string;
    };
};
export type AvatarProps = ExtractPropTypes<typeof avatarProps>;
export declare const avatarEmits: {
    error: (evt: Event) => boolean;
};
export type AvatarEmits = typeof avatarEmits;
export type AvatarInstance = InstanceType<typeof Avatar>;
