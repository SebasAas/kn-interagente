"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";
import Subtitle from "../../Text/Subtitle";
import UserCard from "../User/UserCard";

import Table from "../../../(components)/Table";

import { withErrorBoundary } from "react-error-boundary";
import Fallback from "../../ErrorBoundary";

function Ranking({
  rankingData,
  selectedKeys,
  setSelectedKeys,
}: {
  rankingData: any;
  selectedKeys: any;
  setSelectedKeys: any;
}) {
  return (
    <Card className="p-4 w-full">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <div className="flex w-full justify-between">
          <div className="w-1/2">
            <Subtitle>Ranking de usuários</Subtitle>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-visible py-2 gap-6">
        <div className="flex gap-4 mt-5 justify-around">
          <UserCard
            name={rankingData[0]?.worker_code || ""}
            position={1}
            medal="gold"
            score={rankingData[0]?.score || ""}
          />
          <UserCard
            name={rankingData[1]?.worker_code || ""}
            position={2}
            medal="silver"
            score={rankingData[1]?.score || ""}
          />
          <UserCard
            name={rankingData[2]?.worker_code || ""}
            position={3}
            medal="bronze"
            score={rankingData[2]?.score || ""}
          />
        </div>
        <div>
          <Table
            rankingTable={rankingData}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
          />
        </div>
      </CardBody>
    </Card>
  );
}

export default withErrorBoundary(Ranking, {
  fallback: <Fallback />,
});
