import React, { SVGProps } from "react";

function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="13"
      viewBox="0 0 8 13"
      fill="none"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.21289 11.8845C1.89254 12.2198 1.35711 12.2198 1.03676 11.8845C0.736437 11.5701 0.736436 11.0752 1.03676 10.7608L5.1075 6.5L1.03676 2.23917C0.736436 1.92483 0.736436 1.42987 1.03676 1.11552C1.35711 0.780217 1.89254 0.780217 2.21288 1.11552L7.35714 6.5L2.21289 11.8845Z"
        fill="#353535"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="13"
      viewBox="0 0 8 13"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.78711 1.11552C6.10746 0.780217 6.64289 0.780217 6.96324 1.11552C7.26356 1.42987 7.26356 1.92483 6.96324 2.23918L2.8925 6.5L6.96324 10.7608C7.26356 11.0752 7.26356 11.5701 6.96324 11.8845C6.64289 12.2198 6.10746 12.2198 5.78711 11.8845L0.642856 6.5L5.78711 1.11552Z"
        fill="#353535"
      />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="9"
      viewBox="0 0 14 9"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.71811 2.49837C0.32692 2.12463 0.32692 1.49996 0.71811 1.12622C1.08485 0.775843 1.6623 0.775843 2.02904 1.12622L7 5.87541L11.971 1.12622C12.3377 0.775843 12.9152 0.775843 13.2819 1.12622C13.6731 1.49996 13.6731 2.12463 13.2819 2.49837L7 8.5L0.71811 2.49837Z"
        fill="#353535"
      />
    </svg>
  );
}

export { ArrowRightIcon, ArrowLeftIcon, ArrowDownIcon };
