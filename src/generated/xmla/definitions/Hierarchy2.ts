import type { Translations10 } from "./Translations10";
import type { AllMemberTranslations } from "./AllMemberTranslations";
import type { Levels } from "./Levels";
import type { Annotations42 } from "./Annotations42";
import type { VisualizationProperties2 } from "./VisualizationProperties2";

/**
 * Hierarchy
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Hierarchy2 {
  /** xsd:string */
  Name?: string;
  /** xsd:string */
  ID?: string;
  /** xsd:string */
  Description?: string;
  /** xsd:string|Processed,Unprocessed,InvalidExpression,DependencyError,CalculationError */
  ProcessingState?: string;
  /** xsd:string|Natural,Unnatural,Unknown */
  StructureType?: string;
  /** xsd:string */
  DisplayFolder?: string;
  /** Translations */
  Translations?: Translations10;
  /** xsd:string */
  AllMemberName?: string;
  /** AllMemberTranslations */
  AllMemberTranslations?: AllMemberTranslations;
  /** xsd:boolean */
  MemberNamesUnique?: string;
  /** xsd:string|NotUnique,Unique */
  MemberKeysUnique?: string;
  /** xsd:boolean */
  AllowDuplicateNames?: string;
  /** Levels */
  Levels?: Levels;
  /** Annotations */
  Annotations?: Annotations42;
  /** VisualizationProperties */
  VisualizationProperties?: VisualizationProperties2;
}
