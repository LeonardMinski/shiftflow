import { gql, TypedDocumentNode } from "@apollo/client";

import { WeekPublicationData, WeekPublicationVariables } from "@/types/rota";

export const GET_WEEK_PUBLICATION: TypedDocumentNode<
  WeekPublicationData,
  WeekPublicationVariables
> = gql`
  query GetWeekPublication($weekStart: String!) {
    weekPublication(weekStart: $weekStart) {
      id
      weekStart
      publishedAt
    }
  }
`;
