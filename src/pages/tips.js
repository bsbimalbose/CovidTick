import React from "react";
import { Card } from "antd";

export default function Tips() {
  return (
    <div>
      <Card
        title={
          <div className="main-title">
            <i className="logo"></i>CovidTick - Be Safe
          </div>
        }
        bordered={false}
      >
        some tips
      </Card>
    </div>
  );
}
