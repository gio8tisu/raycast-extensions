import { List } from "@raycast/api";
import React from "react";
import { TimeInfo } from "../types/types";

export function TimeInfoDetail(props: { timeInfo: TimeInfo; detailLoading: boolean }) {
  const { detailLoading, timeInfo } = props;
  return (
    <List.Item.Detail
      isLoading={detailLoading}
      metadata={
        typeof timeInfo.datetime !== "undefined" && (
          <List.Item.Detail.Metadata>
            <List.Item.Detail.Metadata.Label title="Date Time" text={timeInfo.datetime} />
            <List.Item.Detail.Metadata.Separator />
            <List.Item.Detail.Metadata.Label title="UTC Time" text={timeInfo.utc_datetime} />
            <List.Item.Detail.Metadata.Separator />
            <List.Item.Detail.Metadata.Label title="UTC Offset" text={timeInfo.utc_offset} />
            <List.Item.Detail.Metadata.Separator />
            <List.Item.Detail.Metadata.Label title="Day of Week" text={timeInfo.day_of_week + ""} />
            <List.Item.Detail.Metadata.Separator />
            <List.Item.Detail.Metadata.Label title="Day of Year" text={timeInfo.day_of_year + ""} />
            <List.Item.Detail.Metadata.Separator />
            <List.Item.Detail.Metadata.Label title="Week Number" text={timeInfo.week_number + ""} />
            <List.Item.Detail.Metadata.Separator />
            <List.Item.Detail.Metadata.Label title="Abbreviation" text={timeInfo.abbreviation} />
            <List.Item.Detail.Metadata.Separator />
            <List.Item.Detail.Metadata.Label title="Timezone" text={timeInfo.timezone} />
            <List.Item.Detail.Metadata.Separator />
            <List.Item.Detail.Metadata.Label title="Client IP" text={timeInfo.client_ip} />
            <List.Item.Detail.Metadata.Separator />
          </List.Item.Detail.Metadata>
        )
      }
    />
  );
}
