import { MDSchemaDimensionType } from "@/@types/Constants";

export enum TreeItemTypesEnum {
  Dimension,
  Hierarchy,
  Folder,
  Level,
  MeasureGroup,
  Measure,
  Set,
  Property,
  SetsFolder,
  Member,
  Loading,
  LoadMore,
}

export interface TreeItem {
  caption: string;
  id: string;
  type: number;
}

export interface DimensionTreeItem extends TreeItem {
  type: TreeItemTypesEnum.Dimension;
  isMeasureDimension: boolean;
  children: TreeItem[];
}

export interface HierarchyTreeItem extends TreeItem {
  type: TreeItemTypesEnum.Hierarchy;
  children: TreeItem[];
  originalItem: MDSchemaHierarchy;
  filters: {
    enabled: boolean;
  };
}

export interface FolderTreeItem extends TreeItem {
  type: TreeItemTypesEnum.Folder;
  name: string;
  children: TreeItem[];
}

export interface LevelTreeItem extends TreeItem {
  type: TreeItemTypesEnum.Level;
  children: TreeItem[];
}

export interface SetsFolderTreeItem extends TreeItem {
  type: TreeItemTypesEnum.SetsFolder;
  children: SetTreeItem[];
}

export interface SetTreeItem extends TreeItem {
  type: TreeItemTypesEnum.Set;
}

export interface MeasureGroupTreeItem extends TreeItem {
  type: TreeItemTypesEnum.MeasureGroup;
  children: MeasureTreeItem[];
}

export interface MeasureTreeItem extends TreeItem {
  type: TreeItemTypesEnum.Measure;
  originalItem: MDSchemaMeasure;
}

export interface PropertyTreeItem extends TreeItem {
  type: TreeItemTypesEnum.Property;
}

export interface LoadingTreeItem extends TreeItem {
  type: TreeItemTypesEnum.Loading;
  caption: "";
}

export interface LoadMoreTreeItem extends TreeItem {
  type: TreeItemTypesEnum.LoadMore;
  caption: "";
  onClick: Function;
}

export interface MemberTreeItem extends TreeItem {
  type: TreeItemTypesEnum.Member;
  children: any[];
  hasChildren: boolean;
  __MDSchemaMember: MDSchemaMember;
}

export function getDimensionDesc(
  dimension: MDSchemaDimension
): DimensionTreeItem {
  return {
    type: TreeItemTypesEnum.Dimension,
    isMeasureDimension:
      dimension.DIMENSION_TYPE === MDSchemaDimensionType.MD_DIMTYPE_MEASURE,
    children: [],
    id: `Dimension(${dimension.DIMENSION_UNIQUE_NAME})`,
    caption: dimension.DIMENSION_CAPTION,
  };
}

export function getHierarchyDesc(
  hierarchy: MDSchemaHierarchy
): HierarchyTreeItem {
  return {
    type: TreeItemTypesEnum.Hierarchy,
    children: [],
    id: `Dimension(${hierarchy.DIMENSION_UNIQUE_NAME})_Hierarchy(${hierarchy.HIERARCHY_UNIQUE_NAME})`,
    caption: hierarchy.HIERARCHY_CAPTION,
    originalItem: hierarchy,
    filters: {
      enabled: false,
    },
  };
}

export function getFolderDesc(name: string, id: string): FolderTreeItem {
  return {
    type: TreeItemTypesEnum.Folder,
    name: name,
    children: [],
    caption: name,
    id: `Folder_${id}`,
  };
}

export function getLevelDesc(level: MDSchemaLevel): LevelTreeItem {
  return {
    type: TreeItemTypesEnum.Level,
    children: [],
    caption: level.LEVEL_CAPTION,
    id: `Dimension(${level.DIMENSION_UNIQUE_NAME})_Hierarchy(${level.HIERARCHY_UNIQUE_NAME})_Level(${level.LEVEL_UNIQUE_NAME})`,
  };
}

export function getMeasureGroupDesc(
  measureGroup: MDSchemaMeasureGroup
): MeasureGroupTreeItem {
  return {
    type: TreeItemTypesEnum.MeasureGroup,
    children: [],
    caption: measureGroup.MEASUREGROUP_CAPTION,
    id: `MeasureGroup(${measureGroup.MEASUREGROUP_NAME})`,
  };
}

export function getMeasureDesc(
  measure: MDSchemaMeasure,
  mg?: MDSchemaMeasureGroup
): MeasureTreeItem {
  if (mg) {
    return {
      type: TreeItemTypesEnum.Measure,
      caption: measure.MEASURE_CAPTION,
      id: `MeasureGroup(${mg.MEASUREGROUP_NAME})_Measure(${measure.MEASURE_UNIQUE_NAME})`,
      originalItem: measure,
    };
  } else {
    return {
      type: TreeItemTypesEnum.Measure,
      caption: measure.MEASURE_CAPTION,
      id: `Measure(${measure.MEASURE_UNIQUE_NAME}_${measure.MEASURE_DISPLAY_FOLDER})`,
      originalItem: measure,
    };
  }
}

export function getSetsFolderDesc(
  dimension?: MDSchemaDimension
): SetsFolderTreeItem {
  if (dimension) {
    return {
      type: TreeItemTypesEnum.SetsFolder,
      children: [],
      caption: "Sets",
      id: `Dimension(${dimension.DIMENSION_UNIQUE_NAME})_SetsFolder`,
    };
  } else {
    return {
      type: TreeItemTypesEnum.SetsFolder,
      children: [],
      caption: "Sets",
      id: `SetsFolder`,
    };
  }
}

export function getSetDesc(
  set: MDSchemaSet,
  dimension?: MDSchemaDimension
): SetTreeItem {
  if (dimension) {
    return {
      type: TreeItemTypesEnum.Set,
      caption: set.SET_CAPTION,
      id: `Dimension(${dimension.DIMENSION_UNIQUE_NAME})_Set(${set.SET_NAME})`,
    };
  } else {
    return {
      type: TreeItemTypesEnum.Set,
      caption: set.SET_CAPTION,
      id: `Set(${set.SET_DISPLAY_FOLDER} ${set.SET_NAME})`,
    };
  }
}

export function getPropertyDesc(property: MDSchemaProperty): PropertyTreeItem {
  return {
    type: TreeItemTypesEnum.Property,
    caption: property.PROPERTY_CAPTION,
    id: `Dimemsion(${property.DIMENSION_UNIQUE_NAME})_Hierarchy(${property.HIERARCHY_UNIQUE_NAME})_Level(${property.LEVEL_UNIQUE_NAME})_Property(${property.PROPERTY_NAME})`,
  };
}

export function getLoadingItemDesc(parentId: string): LoadingTreeItem {
  return {
    type: TreeItemTypesEnum.Loading,
    caption: "",
    id: `${parentId}_Loading`,
  };
}
export function getLoadMoreItemDesc(
  parentId: string,
  onClick: Function
): LoadMoreTreeItem {
  return {
    type: TreeItemTypesEnum.LoadMore,
    caption: "",
    id: `${parentId}_LoadMore`,
    onClick,
  };
}

export function getMemberDesc(member: MDSchemaMember): MemberTreeItem {
  return {
    type: TreeItemTypesEnum.Member,
    caption: member.MEMBER_CAPTION,
    id: `Dimemsion(${member.DIMENSION_UNIQUE_NAME})_Hierarchy(${member.HIERARCHY_UNIQUE_NAME})_Level(${member.LEVEL_UNIQUE_NAME})_Member(${member.MEMBER_UNIQUE_NAME})`,
    children: [],
    hasChildren: member.HAS_CHILDREN,
    __MDSchemaMember: member,
  };
}
