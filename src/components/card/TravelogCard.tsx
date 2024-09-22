import React from "react";
import { Text } from "../common/Text";
import { useRouter } from "next/navigation";

type TravelogCardProps = {
  id: string;
  image: string;
  userName: string;
  userImage: string;
  title: string;
  locations?: string[];
};

export default function TravelogCard({
  id,
  image,
  userName,
  userImage,
  title,
  locations,
}: TravelogCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/fanpool-log/log/${id}`);
  };
  return (
    <div
      className="flex flex-col items-start w-235pxr h-302pxr rounded-t-8pxr relative shadow-[0px_0px_34px_0px_rgba(0,37,97,0.10)]"
      onClick={handleClick}
      style={{ width: "235px" }}
    >
      <div className="self-stretch w-full h-180pxr">
        <img className="w-full h-full" src={image} />
      </div>
      <div className="absolute top-150pxr left-10pxr w-40pxr h-40pxr rounded-full border-1pxr border-gray300 z-10">
        <img className="w-full h-full" src={userImage} />
      </div>
      <div className="flex flex-col justify-center items-start gap-10pxr self-stretch p-30pxr px-14pxr rounded-b-8pxr bg-gray000">
        <div className="flex flex-col items-start gap-4pxr self-stretch">
          <div className="flex items-center">
            <Text fontSize={12} fontWeight={700}>
              {userName}
            </Text>
            <Text fontSize={12} fontWeight={500} color="gray600">
              님의 로그
            </Text>
          </div>
          <Text fontSize={16} fontWeight={700} color="gray800">
            {title}
          </Text>
          {locations && (
            <div className="flex items-center">
              <Text fontSize={14} fontWeight={600} color="gray600">
                {locations[0]}
              </Text>
              <Text fontSize={14} fontWeight={400} color="gray600">
                외 {locations.length - 1}곳
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
