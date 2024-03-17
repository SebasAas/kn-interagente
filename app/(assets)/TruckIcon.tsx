import React from "react";

function TruckIcon() {
  return (
    <svg
      width="26"
      height="24"
      viewBox="0 0 26 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_dd_1537_294)">
        <path
          d="M15.9091 1.45457H5V10.9091H15.9091V1.45457Z"
          stroke="#353535"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.9092 5.09093H18.8183L21.0001 7.27275V10.9091H15.9092V5.09093Z"
          stroke="#353535"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.27277 14.5455C9.27693 14.5455 10.091 13.7315 10.091 12.7273C10.091 11.7231 9.27693 10.9091 8.27277 10.9091C7.26862 10.9091 6.45459 11.7231 6.45459 12.7273C6.45459 13.7315 7.26862 14.5455 8.27277 14.5455Z"
          stroke="#353535"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.7274 14.5455C18.7315 14.5455 19.5455 13.7315 19.5455 12.7273C19.5455 11.7231 18.7315 10.9091 17.7274 10.9091C16.7232 10.9091 15.9092 11.7231 15.9092 12.7273C15.9092 13.7315 16.7232 14.5455 17.7274 14.5455Z"
          stroke="#353535"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_dd_1537_294"
          x="0.5"
          y="0.954575"
          width="25"
          height="22.0909"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1537_294"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_1537_294"
            result="effect2_dropShadow_1537_294"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1537_294"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default TruckIcon;
