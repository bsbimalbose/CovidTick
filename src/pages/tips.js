import React from "react";
import { Card, Collapse } from "antd";
const { Panel } = Collapse;

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
        <p>General public health information</p>
        <Collapse>
          <Panel header="STAY home" key="1">
            <p>
              Stay at home if you begin to feel unwell, even with mild symptoms
              such as headache and slight runny nose, until you recover.
            </p>
            <p>
              Avoiding contact with others and visits to medical facilities will
              allow these facilities to operate more effectively and help
              protect you and others from possible COVID-19 and other viruses.
            </p>
          </Panel>
          <Panel header="KEEP a safe distance" key="2">
            <p>
              Maintain at least 1 metre (3 feet) distance between yourself and
              anyone else.
            </p>
            <p>
              To prevent COVID-19 it is safest to avoid physical contact when
              greeting.
            </p>
            <p>
              Respiratory viruses can be passed by shaking hands and touching
              your eyes, nose or mouth.
            </p>
            <p>Safe greetings include a wave, a nod, or a bow.</p>
          </Panel>
          <Panel header="WASH hands often" key="3">
            <p>
              Wash your hands often with soap and running water for at-least 20
              seconds.
            </p>
            <p>
              Use an alcohol based hand rub when soap and water are unavailable.
            </p>
          </Panel>
          <Panel header="COVER your cough" key="4">
            <p>
              When coughing or sneezing cover mouth and bose with flexed elbow
              or tissue.
            </p>
            <p>Throw tissue into closed bin immediately after use.</p>
            <p>
              Clean hands with alcohol based hand run or soap and water after
              coughing or sneezing.
            </p>
          </Panel>
          <Panel header="SICK? Call the helpline" key="5">
            <p>
              If you have a fever, cough and difficulty breathing, seek medical
              attention and call in advance.
            </p>
            <p>
              Calling in advance will allow your health care provider to quickly
              direct you to the right health facility.
            </p>
            <p>Follow the directions of your local health authority.</p>
          </Panel>
        </Collapse>

        <div className="p20">
          <a
            target="_blank"
            href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public"
          >
            More Info
          </a>
        </div>
      </Card>
    </div>
  );
}
