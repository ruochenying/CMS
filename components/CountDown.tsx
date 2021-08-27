import { Col, Row } from "antd";
import { isFuture } from "date-fns";
import React, { Fragment, useEffect, useState } from "react";

export interface CountDownProps {}

const CountDown = ({ time }) => {
  const [timerDays, setTimerDays] = useState(0);
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);

  let interval;

  const startTimer = () => {
    const countDownDate = new Date(time).getTime();

    interval = setInterval(() => {
      const now = new Date().getTime();

      const distance = countDownDate - now;

      const days = Math.floor(distance / (24 * 60 * 60 * 1000));
      const hours = Math.floor(
        (distance % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (60 * 60 * 1000)) / (1000 * 60));
      const seconds = Math.floor((distance % (60 * 1000)) / 1000);

      if (distance < 0) {
        clearInterval(interval.current);
      } else {
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    });
  };

  useEffect(() => {
    startTimer();
  });
  return (
    <>
      <Row align="middle">
        {isFuture(new Date(time)) ? "Cutdown" : "In Progress"}
      </Row>
      <Row>
        <Col
          flex={1}
        >{`${timerDays} Days ${timerHours} Hours ${timerMinutes} Mins ${timerSeconds} Seconds`}</Col>
      </Row>
    </>
  );
};

export default CountDown;
