
import React, { useState, useEffect, useRef  } from 'react';
import { Card, Button, Input, DatePicker, Modal, } from 'antd';
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  createFlightTicketPurchaseMessage,
} from '../../utils/message-converter';
import CheckCircleSvg from '../../images/check-circle.svg';
import SelectSeatsCardSvg from '../../images/select-seats-card.svg';


const Container = styled.div`
  width: 100%;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 2px 0px #DDD;
  display: inline-block;
  margin: 0.25rem 0.5rem;
  overflow: hidden;
  width: 300px;
  text-align: left;

  .header {
    height: 20px;
    background-color: #00539C;
    color: white;
    padding: 10px;
    
    span {
      float: left;
    }
    
    span.date {
      float: right;
      background-color: #236BA4;
      border-radius: 5px;
      padding: 5px;
      font-size: 10px;
    }
  }

  .content {
    padding: 10px;
    
    hr {
      border-style: solid;
      border-color: #DBDBDB;
    }
    
    table {
      width: 100%;
    }
    
    td {
      text-align: right;
    }
  }

  .footer {
    background-color: #FAFAFA;
    height: 20px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    span {
      color: #58646D;
    }
  }

  .confirmed {
    cursor: default;
  }
`;

// const Container = styled.div`
//   text-align: left;
//   border: 0.1px solid #222;
//   border-radius: 4px;
// `;

const Content = styled.div`
  padding: 0.5em 1em;

  table {
    width: 100%;
    
    tbody th {
      font-weight: normal;
    }
  }
`;

const Action = styled.div`
  display: flex;

  Button {
    flex-grow: 1;
    margin: 12px;
  }
`;

export default function FlightSeatView({ m, registerFunc }) {
  const {
    title,
    contents,
  } = m.customMessage;

  const {
    price,
    tax,
    amount,
    date,
    confirmed,
  } = contents.order;

  const [isShowModal, setShowModal] = useState(false);


  function purchase() {
    setShowModal(false);

    const order = Object.assign(
      { price, tax, amount, date },
      { confirmed: true }
    );

    const messageStr = createFlightTicketPurchaseMessage(
      undefined,
      { order },
    );
    registerFunc(messageStr);
  }

  try {
    const footer =
      confirmed ?
      (
        <div className="footer confirmed">
          <span>購入済み</span>
          <svg height="22px" width="22px" version="1.1" viewBox="0 0 22 22">
            <defs/>
            <g id="Symbols" fill="none" stroke="none" strokeWidth="1">
              <g id="confirmation/complete" transform="translate(-222.000000, -17.000000)">
                <circle id="Oval-6" cx="233" cy="28" fill="#BE2026" r="10" stroke="#BE2026"/>
                <polygon id="Check" fill="#FFFFFF" points="228.5 27.5 227 29 231 33 240 24.5 238.5 23 231 30"/>
              </g>
            </g>
          </svg>
        </div>
      )
      : (
        <div className="footer" onClick={() => setShowModal(true)}>
          <span>内容を確認し購入する</span>
          <svg height="32px" width="31px" version="1.1" viewBox="0 0 31 32">
            <defs/>
            <g id="Symbols" fill="none" stroke="none" strokeLinecap="round" strokeWidth="1">
              <g id="confirmation/requested" stroke="#2F3F49" strokeWidth="1.42749977" transform="translate(-242.000000, -12.000000)">
                <path id="Touch-ID" d="M272.177992,28 C272.177992,20.7655626 266.944173,14.753549 260.056432,13.543856 M257.305053,13.3232765 C251.623434,13.3972326 246.720443,16.6993286 244.346296,21.4793474 M243.387027,23.9529611 C243.019066,25.2385132 242.822008,26.596244 242.822008,28 C242.822008,29.7027475 243.111949,31.3377756 243.645154,32.8584069 M269.449487,25.4876228 C268.291171,19.9504543 263.381247,15.7917278 257.5,15.7917278 C255.872232,15.7917278 254.31887,16.1102992 252.89886,16.6884954 M250.447424,18.0336941 C247.327766,20.2453086 244.393648,24.9376825 245.572378,30.6100444 M245.457107,36.2752032 C245.679536,35.2830841 245.796898,34.2512596 245.796898,33.1920238 C245.796898,32.2893953 245.711674,31.4066717 245.548835,30.5514608 M267.010262,25.8941178 C266.423578,23.2326495 264.748162,20.9797478 262.474867,19.6262627 M260.048147,18.5982056 C259.235942,18.3786065 258.381653,18.2614472 257.5,18.2614472 C252.121546,18.2614472 247.761447,22.6215458 247.761447,28 C247.761447,28 247.705317,28.4209749 247.985967,30.2171345 M263.245378,23.4038941 C261.897327,21.739237 259.836975,20.6750367 257.528065,20.6750367 C253.4671,20.6750367 250.175037,23.9670996 250.175037,28.028065 C250.175037,28.028065 250.231167,29.3751847 250.455687,30.1610045 M262.345696,27.1948354 C261.961531,24.8654018 259.938259,23.0886261 257.5,23.0886261 C256.921342,23.0886261 256.366057,23.1886991 255.850508,23.3724827 M253.757366,24.8195523 C253.028462,25.6764601 252.588626,26.7868654 252.588626,28 C252.588626,28 252.644756,29.3751848 252.925406,30.1610046 M259.838029,27.4987847 C259.618961,26.4235533 258.667998,25.6144755 257.528065,25.6144755 C256.226076,25.6144755 255.170606,26.6699461 255.170606,27.971935 C255.170606,27.971935 255.170606,28.4209749 255.282866,28.9822748 M270.290982,35.0788357 C270.332078,34.5463291 270.352839,34.0108623 270.352839,33.4726737 C270.352839,33.2260354 270.348479,32.9799687 270.339799,32.7344965 M270.162435,29.9984322 C270.017836,28.4677087 269.778663,26.9645164 269.450823,25.4947612 M267.421453,38.8407799 C267.70737,37.0749502 267.855983,35.2631021 267.855983,33.4165438 C267.855983,30.8325126 267.564961,28.3164532 267.013906,25.8993533 M264.381357,40.8495315 C265.072837,38.3589679 265.442393,35.7344581 265.442393,33.0236338 C265.442393,30.5708225 265.139837,28.1886769 264.57001,25.9124817 M261.346829,42.1328203 C262.363677,39.2286797 262.916544,36.1065262 262.916544,32.8552439 C262.916544,30.9233848 262.721352,29.0371153 262.349614,27.2150812 M258.603956,42.5685744 C259.455255,40.4698883 260.032599,38.2308168 260.291619,35.8957276 M260.446824,33.0797638 C260.446824,31.1592155 260.232477,29.2887308 259.826399,27.4909275 M255.999828,42.5565982 C255.999828,42.5565982 256.452383,41.4276503 256.64845,40.8486173 M257.34793,38.3704164 C257.759678,36.5607931 257.977105,34.67728 257.977105,32.7429839 C257.977105,31.1312622 257.82615,29.554798 257.537606,28.0269586 M253.488931,42.0136235 C254.820364,39.1440984 255.563515,35.9461323 255.563515,32.574594 C255.563515,31.3478422 255.465129,30.1440697 255.275817,28.9707368 M251.185376,41.1624816 C252.420236,38.7488922 253.149926,35.9244329 253.149926,33.0236338 C253.149926,32.0418092 253.065897,31.0796105 252.904639,30.1438369 M250.609408,34.4658859 C250.656262,33.9539972 250.680207,33.4354818 250.680207,32.9113739 C250.680207,31.9465199 250.599058,31.0006193 250.443213,30.0801248 M249.138364,39.9601878 C249.549455,39.06953 249.885049,38.1368678 250.13694,37.1704073 M247.227226,38.33343 C247.897275,36.6955198 248.266617,34.9027091 248.266617,33.0236338 C248.266617,32.0551402 248.168502,31.1095626 247.98167,30.1962983"/>
              </g>
            </g>
          </svg>
        </div>
      );


    return (
      <>
        {title && <div>{title}</div>}
        <Container>
          <div className="header">
            <span>航空券購入</span>
            <span className="date">{date}</span>
          </div>
          <div className="content">
            購入情報
            <hr/>
            <table>
              <tbody>
                <tr>
                  <th>航空券</th>
                  <td>{price}</td>
                </tr>
                <tr>
                  <th>税金</th>
                  <td>{tax}</td>
                </tr>
                <tr>
                  <th>合計</th>
                  <td>{amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {footer}
        </Container>

        <Modal
          title="航空券を購入する"
          visible={isShowModal}
          onOk={purchase}
          onCancel={() => setShowModal(false)}
        >
          <p>ご登録されている決済情報で航空券を購入しますか？</p>
        </Modal>
      </>
    );
  } catch (e) {
    return (
      <Container>
        <p>Could not parse carousel content</p>
      </Container>
    )
  }
}
