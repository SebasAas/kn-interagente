import Medal from "@/app/(assets)/MedalIcon";
import { Avatar, Card, CardBody, CardFooter, Divider } from "@nextui-org/react";
import React from "react";
import Text from "../Text/Text";

function UserCard({
  name,
  position,
  medal,
  score,
}: {
  name: string;
  position: number;
  medal: "gold" | "silver" | "bronze";
  score: number;
}) {
  return (
    <Card className="p-2 overflow-visible bg-[#F1F0F9] w-1/3 ">
      <CardBody className="flex flex-row justify-center items-center gap-4 overflow-hidden">
        <div>
          <Text className="uppercase text-sm font-medium">{name}</Text>
          <div className="flex gap-1 mt-1 justify-center items-center">
            <Text className="text-3xl font-semibold">{position}°</Text>
            <Medal color={medal} />
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="flex flex-col">
        <Text>Score</Text>
        <Text className="text-3xl font-semibold">{score}</Text>
      </CardFooter>
    </Card>
  );
}

export default UserCard;
