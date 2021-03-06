/**
 * This file was automatically generated by Nexus 0.11.7
 * Do not make changes to this file directly
 */




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenRootTypes {
  ActionStatus: { // root type
    success?: boolean | null; // Boolean
  }
  DeadList: {};
  ErrorLog: { // root type
    message?: string | null; // String
    name?: string | null; // String
    stack?: string | null; // String
  }
  FailedList: {};
  Mutation: {};
  Query: {};
  Queue: { // root type
    name: string; // String!
  }
  ResultList: {};
  Stat: { // root type
    dead: number; // Int!
    failed: number; // Int!
    processed: number; // Int!
    retries: number; // Int!
    waiting: number; // Int!
  }
  Task: { // root type
    at?: string | null; // String
    data?: string | null; // String
    dedupKey?: string | null; // String
    error?: NexusGenRootTypes['ErrorLog'] | null; // ErrorLog
    id?: string | null; // String
    qname?: string | null; // String
    result?: string | null; // String
    retryCount?: number | null; // Int
  }
  TaskFeed: { // root type
    hasNextPage: boolean; // Boolean!
    nextCursor?: string | null; // String
    tasks?: NexusGenRootTypes['Task'][] | null; // [Task!]
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
}

export interface NexusGenFieldTypes {
  ActionStatus: { // field return type
    success: boolean | null; // Boolean
  }
  DeadList: { // field return type
    taskCount: number; // Int!
    taskFeed: NexusGenRootTypes['TaskFeed'] | null; // TaskFeed
  }
  ErrorLog: { // field return type
    message: string | null; // String
    name: string | null; // String
    stack: string | null; // String
  }
  FailedList: { // field return type
    taskCount: number; // Int!
    taskFeed: NexusGenRootTypes['TaskFeed'] | null; // TaskFeed
  }
  Mutation: { // field return type
    deleteQueue: NexusGenRootTypes['ActionStatus'] | null; // ActionStatus
    pauseAll: NexusGenRootTypes['ActionStatus'] | null; // ActionStatus
    resetGlobalStats: NexusGenRootTypes['ActionStatus'] | null; // ActionStatus
    resumeAll: NexusGenRootTypes['ActionStatus'] | null; // ActionStatus
    updateGlobalSettings: NexusGenRootTypes['ActionStatus'] | null; // ActionStatus
  }
  Query: { // field return type
    deadList: NexusGenRootTypes['DeadList'] | null; // DeadList
    failedList: NexusGenRootTypes['FailedList'] | null; // FailedList
    queue: NexusGenRootTypes['Queue'] | null; // Queue
    queueNames: string[]; // [String!]!
    resultList: NexusGenRootTypes['ResultList'] | null; // ResultList
    stat: NexusGenRootTypes['Stat']; // Stat!
  }
  Queue: { // field return type
    activeWorkerCount: number; // Int!
    isPaused: boolean; // Boolean!
    name: string; // String!
    stat: NexusGenRootTypes['Stat']; // Stat!
    taskFeed: NexusGenRootTypes['TaskFeed'] | null; // TaskFeed
  }
  ResultList: { // field return type
    taskCount: number; // Int!
    taskFeed: NexusGenRootTypes['TaskFeed'] | null; // TaskFeed
  }
  Stat: { // field return type
    dead: number; // Int!
    failed: number; // Int!
    processed: number; // Int!
    retries: number; // Int!
    waiting: number; // Int!
  }
  Task: { // field return type
    at: string | null; // String
    data: string | null; // String
    dedupKey: string | null; // String
    error: NexusGenRootTypes['ErrorLog'] | null; // ErrorLog
    id: string | null; // String
    qname: string | null; // String
    result: string | null; // String
    retryCount: number | null; // Int
  }
  TaskFeed: { // field return type
    hasNextPage: boolean; // Boolean!
    nextCursor: string | null; // String
    tasks: NexusGenRootTypes['Task'][] | null; // [Task!]
  }
}

export interface NexusGenArgTypes {
  DeadList: {
    taskFeed: { // args
      limit?: number | null; // Int
      nextCursor?: string | null; // String
    }
  }
  FailedList: {
    taskFeed: { // args
      limit?: number | null; // Int
      nextCursor?: string | null; // String
    }
  }
  Query: {
    deadList: { // args
      queueName?: string | null; // String
    }
    failedList: { // args
      queueName?: string | null; // String
    }
    queue: { // args
      name: string; // String!
    }
    resultList: { // args
      queueName?: string | null; // String
    }
    stat: { // args
      queueName?: string | null; // String
    }
  }
  Queue: {
    taskFeed: { // args
      limit?: number | null; // Int
      nextCursor?: string | null; // String
    }
  }
  ResultList: {
    taskFeed: { // args
      limit?: number | null; // Int
      nextCursor?: string | null; // String
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "ActionStatus" | "DeadList" | "ErrorLog" | "FailedList" | "Mutation" | "Query" | "Queue" | "ResultList" | "Stat" | "Task" | "TaskFeed";

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}