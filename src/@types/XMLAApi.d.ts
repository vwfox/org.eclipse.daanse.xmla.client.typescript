/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
declare interface DBSchemaCatalog {
    CATALOG_NAME: string;
    DESCRIPTION: string;
}

declare interface MDSchemaCube {
    CUBE_NAME: string;
    CUBE_CAPTION: string;
}

declare interface MDSchemaDimension {
    CATALOG_NAME: string;
    CUBE_NAME: string;
    DIMENSION_NAME: string;
    DIMENSION_UNIQUE_NAME: string;
    DIMENSION_CAPTION: string;
    DIMENSION_TYPE: string;
}

declare interface MDSchemaHierarchy {
    CATALOG_NAME: string;
    CUBE_NAME: string;
    DIMENSION_UNIQUE_NAME: string;
    HIERARCHY_CAPTION: string;
    HIERARCHY_NAME: string;
    HIERARCHY_UNIQUE_NAME: string;
    HIERARCHY_DISPLAY_FOLDER: string;
}

declare interface MDSchemaLevel {
    CATALOG_NAME: string;
    CUBE_NAME: string;
    DIMENSION_UNIQUE_NAME: string;
    HIERARCHY_UNIQUE_NAME: string;
    LEVEL_NAME: string;
    LEVEL_UNIQUE_NAME: string;
    LEVEL_CAPTION: string;
    LEVEL_NUMBER: string;
    PARENT_UNIQUE_NAME: string;
}

declare interface MDSchemaMeasureGroup {
    CATALOG_NAME: string;
    CUBE_NAME: string;
    MEASUREGROUP_NAME: string;
    MEASUREGROUP_CAPTION: string;
}

declare interface MDSchemaMeasure {
    CATALOG_NAME: string;
    CUBE_NAME: string;
    MEASURE_NAME: string;
    MEASURE_UNIQUE_NAME: string;
    MEASURE_CAPTION: string;
    MEASURE_DISPLAY_FOLDER: string;
    MEASUREGROUP_NAME: string;
}

declare interface MDSchemaSet {
    CATALOG_NAME: string;
    CUBE_NAME: string;
    DIMENSIONS: string;
    SET_NAME: string;
    SET_CAPTION: string;
    SET_DISPLAY_FOLDER: string;
}

declare interface MDSchemaProperty {
    CATALOG_NAME: string;
    CUBE_NAME: string;
    DIMENSION_UNIQUE_NAME: string;
    HIERARCHY_UNIQUE_NAME: string;
    LEVEL_UNIQUE_NAME: string;
    MEMBER_UNIQUE_NAME: string;
    PROPERTY_NAME: string;
    PROPERTY_CAPTION: string;
}

declare interface MDSchemaMember {
    CATALOG_NAME: string;
    CUBE_NAME: string;
    DIMENSION_UNIQUE_NAME: string;
    HIERARCHY_UNIQUE_NAME: string;
    LEVEL_NAME: string;
    LEVEL_UNIQUE_NAME: string;
    LEVEL_CAPTION: string;
    LEVEL_NUMBER: string;
    MEMBER_NAME: string;
    MEMBER_UNIQUE_NAME: string;
    MEMBER_CAPTION: string;
    HAS_CHILDREN: boolean;
    PARENT_UNIQUE_NAME: string;
}
