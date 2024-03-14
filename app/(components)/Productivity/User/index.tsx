import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";
import Subtitle from "../../Text/Subtitle";
import UserProfile from "./UserProfile";

function User({
  rankingData,
  dateInfo,
  selectedKeys,
}: {
  rankingData: any[];
  selectedKeys: Set<string>;
  dateInfo: {
    month: string;
    year: string;
    shift: string;
  };
}) {
  return (
    <div className="flex justify-center w-1/2">
      <Card className="p-4 w-full h-min">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <Subtitle>Informações do Usuário</Subtitle>
        </CardHeader>
        <CardBody>
          <UserProfile
            rankingData={rankingData}
            user={selectedKeys}
            date={{
              month: dateInfo.month,
              year: dateInfo.year,
              shift: dateInfo.shift,
            }}
            selectedKeys={selectedKeys}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default User;
