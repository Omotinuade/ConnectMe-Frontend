const testEndPoint = require("../apicalls/users");

describe("app should call an endpoint", () => {
	it("should call an endpoint ", () => {
		return testEndPoint.GetCurrentUser("sam").then((data) => {
			expect(data).equal("sam");
		});
	});
});
