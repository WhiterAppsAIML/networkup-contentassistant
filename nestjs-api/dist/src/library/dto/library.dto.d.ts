export declare enum ContentStatusEnum {
    DRAFT = "DRAFT",
    ANGLES_GENERATED = "ANGLES_GENERATED",
    HOOKS_GENERATED = "HOOKS_GENERATED",
    HOOK_SELECTED = "HOOK_SELECTED",
    CONTENT_GENERATED = "CONTENT_GENERATED",
    IMPROVED = "IMPROVED",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}
export declare enum HookCategoryEnum {
    CURIOSITY = "CURIOSITY",
    CONTRARIAN = "CONTRARIAN",
    STORY = "STORY",
    QUESTION = "QUESTION"
}
export declare class ContentListQueryDto {
    status?: ContentStatusEnum;
    page?: number;
    limit?: number;
}
export declare class HooksListQueryDto {
    category?: HookCategoryEnum;
    page?: number;
    limit?: number;
}
