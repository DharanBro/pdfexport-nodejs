
var PDFCrosstabUtils= function() {
		return {
			/*
			 * Traverse through a row and see if it contains any kind of span cell
			 * fromIndex and toIndex are optional
			 */
			hasSpanCell : function(row, fromIndex, toIndex) {
				if (!fromIndex) {
					fromIndex = 0;
				}

				if (!toIndex) {
					toIndex = row.length;
				}

				for (var cellCount = fromIndex; cellCount < toIndex; cellCount++) {
					if (row[cellCount].isSpan && row[cellCount].isSpan.toLowerCase() === "true") {
						return true;
					}
				}
				return false;
			},

			/*
			 * For the span position of the input cell, determine the new span position of the cell
			 * and the span position of the bottom half of the cell after expansion.
			 */
			getNewSpanPosAndExpandedCell : function(span) {
				var currCell = {
						rowSpanPos: "N",
						colSpanPos: "N"
				};

				var belowCurrCell = {
						rowSpanPos: "N",
						colSpanPos: "N"
				};

				switch (span) {
					case "NN":
						currCell.rowSpanPos = "S";
						currCell.colSpanPos = "N";
						belowCurrCell.rowSpanPos = "E";
						belowCurrCell.colSpanPos = "N";
						break;
					case "NS":
						currCell.rowSpanPos = "S";
						currCell.colSpanPos = "S";
						belowCurrCell.rowSpanPos = "E";
						belowCurrCell.colSpanPos = "S";
						break;
					case "NM":
						currCell.rowSpanPos = "S";
						currCell.colSpanPos = "M";
						belowCurrCell.rowSpanPos = "E";
						belowCurrCell.colSpanPos = "M";
						break;
					case "NE":
						currCell.rowSpanPos = "S";
						currCell.colSpanPos = "E";
						belowCurrCell.rowSpanPos = "E";
						belowCurrCell.colSpanPos = "E";
						break;
					case "SN":
					case "MN":
						currCell = undefined;
						belowCurrCell.rowSpanPos = "M";
						belowCurrCell.colSpanPos = "N";
						break;
					case "SS":
					case "MS":
						currCell = undefined;
						belowCurrCell.rowSpanPos = "M";
						belowCurrCell.colSpanPos = "S";
						break;
					case "SM":
					case "MM":
						currCell = undefined;
						belowCurrCell.rowSpanPos = "M";
						belowCurrCell.colSpanPos = "M";
						break;
					case "SE":
					case "ME":
						currCell = undefined;
						belowCurrCell.rowSpanPos = "M";
						belowCurrCell.colSpanPos = "E";
						break;
					case "EN":
						currCell.rowSpanPos = "M";
						currCell.colSpanPos = "N";
						belowCurrCell.rowSpanPos = "E";
						belowCurrCell.colSpanPos = "N";
						break;
					case "ES":
						currCell.rowSpanPos = "M";
						currCell.colSpanPos = "S";
						belowCurrCell.rowSpanPos = "E";
						belowCurrCell.colSpanPos = "S";
						break;
					case "EM":
						currCell.rowSpanPos = "M";
						currCell.colSpanPos = "M";
						belowCurrCell.rowSpanPos = "E";
						belowCurrCell.colSpanPos = "M";
						break;
					case "EE":
						currCell.rowSpanPos = "M";
						currCell.colSpanPos = "E";
						belowCurrCell.rowSpanPos = "E";
						belowCurrCell.colSpanPos = "E";
						break;
					default:
						break;
				}

				return [currCell, belowCurrCell];
			},

			// Determine maximum number of cols and rows which will fit on each page size
			getPDFDimensions : function(pgWidth, pgHeight, cellWidthPt, cellHeightPt, marginTop, pageSize, orientation, hasMetadata, hasPageNo, footerText) {
				var pageCrosstabDimensions = {};

				var pageDimensionsPt = {}// PDFUtils().getPageDimensionsPt(pageSize, orientation);
				pageDimensionsPt.width = pgWidth;
				pageDimensionsPt.height = pgHeight;
				pageDimensionsPt.width -= 10*2;	// TODO: include as argument - marginLeft (have the same value for the right margin)
				pageDimensionsPt.height -= marginTop;

				pageCrosstabDimensions.maxCols = Math.floor(pageDimensionsPt.width / cellWidthPt);
				pageCrosstabDimensions.maxRows = Math.floor(pageDimensionsPt.height / cellHeightPt);

				// Give some space for the header
				pageCrosstabDimensions.maxRows -= 4;

				// More space if no footer present
				if (!hasPageNo && footerText === "") {
					pageCrosstabDimensions.maxRows += 3;
				}

				return pageCrosstabDimensions;
			}

		};
	}
	
	 if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFCrosstabUtils;
  } else {
    global.PDFCrosstabUtils = PDFCrosstabUtils;
  }
