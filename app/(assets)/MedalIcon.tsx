import React from "react";

const MEDAL_COLOR = {
  gold: {
    circle: "#FFC24D",
    path: "#FFCA66",
  },
  silver: {
    circle: "#D0CDC7",
    path: "#DED7CB",
  },
  bronze: {
    circle: "#C97E63",
    path: "#D28B7A",
  },
};

function Medal({ color = "gold" }: { color?: keyof typeof MEDAL_COLOR }) {
  return (
    <svg
      width="19"
      height="29"
      viewBox="0 0 19 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 15.9812H15.5V28.9812L9.5 25.5188L3.5 28.9812V15.9812Z"
        fill="#0099DA"
      />
      <path d="M9.5 15.9812H15.5V28.9812L9.5 25.5188V15.9812Z" fill="#00ABF3" />
      <circle cx="9.5" cy="9.51884" r="9.5" fill={MEDAL_COLOR[color].circle} />
      <path
        d="M9.5 0.0188442C10.7476 0.0188441 11.9829 0.26457 13.1355 0.741989C14.2881 1.21941 15.3354 1.91917 16.2175 2.80133C17.0997 3.68349 17.7994 4.73076 18.2769 5.88335C18.7543 7.03595 19 8.27129 19 9.51884C19 10.7664 18.7543 12.0017 18.2769 13.1543C17.7994 14.3069 17.0997 15.3542 16.2175 16.2364C15.3354 17.1185 14.2881 17.8183 13.1355 18.2957C11.9829 18.7731 10.7476 19.0188 9.5 19.0188L9.5 9.51884L9.5 0.0188442Z"
        fill={MEDAL_COLOR[color].path}
      />
    </svg>
  );
}

export default Medal;
