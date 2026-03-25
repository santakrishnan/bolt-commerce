web:test:
web:test:  FAIL |web|  src/app/used-cars/[[...params]]/__tests__/page.test.tsx > UsedCarsPage > details route > passes dealerDataPromise to UsedCarsDetails
web:test: Error: expect(element).toHaveAttribute("data-dealer-promise", "true") // element.getAttribute("data-dealer-promise") === "true"
web:test:
web:test: Expected the element to have attribute:
web:test:   data-dealer-promise="true"
web:test: Received:
web:test:   data-dealer-promise="false"
web:test:  ❯ src/app/used-cars/[[...params]]/__tests__/page.test.tsx:337:55
web:test:     335|     it("passes dealerDataPromise to UsedCarsDetails", async () => {
web:test:     336|       await renderPage(DETAILS_SEGMENTS);
web:test:     337|       expect(screen.getByTestId("used-cars-details")).toHaveAttribute(
web:test:        |                                                       ^
web:test:     338|         "data-dealer-promise",
web:test:     339|         "true"
web:test:
web:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯
web:test:
web:test:  FAIL |web|  src/app/used-cars/[[...params]]/__tests__/page.test.tsx > UsedCarsPage > details route > calls getDealerNotesCached with the VIN
web:test: AssertionError: expected "spy" to be called once, but got 0 times
web:test:  ❯ src/app/used-cars/[[...params]]/__tests__/page.test.tsx:351:36
web:test:     349|     it("calls getDealerNotesCached with the VIN", async () => {
web:test:     350|       await renderPage(DETAILS_SEGMENTS);
web:test:     351|       expect(getDealerNotesCached).toHaveBeenCalledOnce();
web:test:        |                                    ^
web:test:     352|       expect(getDealerNotesCached).toHaveBeenCalledWith(VALID_VIN);
web:test:     353|     });
web:test:
web:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯
web:test:
web:test:  FAIL |web|  src/app/used-cars/[[...params]]/__tests__/page.test.tsx > UsedCarsPage > cached functions > calls cached functions without headers (VIN-only cache key)
web:test: AssertionError: expected "spy" to be called with arguments: [ '1HGBH41JXMN109186' ]
web:test:
web:test: Received:
web:test:
web:test:
web:test:
web:test: Number of calls: 0
web:test:
web:test:  ❯ src/app/used-cars/[[...params]]/__tests__/page.test.tsx:363:36
web:test:     361|       await renderPage(DETAILS_SEGMENTS);
web:test:     362|       expect(getVehicleBundleCached).toHaveBeenCalledWith(VALID_VIN);
web:test:     363|       expect(getDealerNotesCached).toHaveBeenCalledWith(VALID_VIN);
web:test:        |                                    ^
web:test:     364|     });
web:test:     365|   });
web:test:
web:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯
