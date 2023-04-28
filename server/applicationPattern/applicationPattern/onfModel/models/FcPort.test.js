const FcPort = require("./FcPort");

test("isOperationOfFcPortType", async () => {
    const fc = {
        "fc-port" : [
            {
              "local-id" : "000",
              "port-direction" : "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
              "logical-termination-point" : "ol-2-0-1-op-s-bm-009"
            },
            {
              "local-id" : "100",
              "port-direction" : "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
              "logical-termination-point" : "ol-2-0-1-op-s-bm-004"
            },
            {
              "local-id" : "200",
              "port-direction" : "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
              "logical-termination-point" : "ol-2-0-1-op-c-bm-alt-1-0-0-005"
            }
        ]
    }
    expect(FcPort.isOperationOfFcPortType(
        fc, "ol-2-0-1-op-s-bm-009", FcPort.portDirectionEnum.MANAGEMENT)
    ).toBeTruthy();
    expect(FcPort.isOperationOfFcPortType(
        fc, "ol-2-0-1-op-s-bm-009", FcPort.portDirectionEnum.INPUT)
    ).toBeFalsy();
    expect(FcPort.isOperationOfFcPortType(
        fc, "ol-2-0-1-op-s-bm-004", FcPort.portDirectionEnum.INPUT)
    ).toBeTruthy();
    expect(FcPort.isOperationOfFcPortType(
        fc, "ol-2-0-1-op-c-bm-alt-1-0-0-005", FcPort.portDirectionEnum.OUTPUT)
    ).toBeTruthy();
});
