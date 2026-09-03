import { gql, TypedDocumentNode } from "@apollo/client";

import { PublishWeekData, PublishWeekVariables } from "@/types/rota";

export const PUBLISH_WEEK: TypedDocumentNode<
  PublishWeekData,
  PublishWeekVariables
> = gql`
  mutation PublishWeek($weekStart: String!) {
    publishWeek(weekStart: $weekStart) {
      id
      weekStart
      publishedAt
    }
  }
`;
