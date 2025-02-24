import React from "react";
import { Card, CardBody } from "@windmill/react-ui";

function InfoCard({ title, value, children: icon, subtitle }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardBody className="flex items-center">
        {icon}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default InfoCard;
