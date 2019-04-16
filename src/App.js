import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [
                ["0", "4", "3", "1", "0", "0", "0", "0", "0"],
                ["6", "0", "1", "0", "2", "0", "5", "0", "0"],
                ["0", "2", "0", "0", "4", "0", "8", "0", "1"],
                ["0", "0", "0", "0", "0", "0", "0", "8", "0"],
                ["0", "0", "0", "0", "0", "0", "0", "0", "4"],
                ["0", "0", "4", "5", "0", "6", "9", "0", "0"],
                ["0", "0", "0", "0", "0", "3", "0", "0", "7"],
                ["0", "3", "6", "0", "0", "0", "0", "0", "0"],
                ["0", "8", "0", "4", "7", "5", "0", "2", "0"]
            ],
            basis: null,
            solution: []
        };

        //ROW - Reihe, horiyontal
        //COLUMN - Spalte, vertikal

        this.setBasis = this.setBasis.bind(this);
        this.buildGrid = this.buildGrid.bind(this);
        this.changeField = this.changeField.bind(this);
        this.checkGrid = this.checkGrid.bind(this);
        this.checkColumn = this.checkColumn.bind(this);
        this.checkRow = this.checkRow.bind(this);
        this.checkBlock = this.checkBlock.bind(this);
        this.determinBlock = this.determinBlock.bind(this);
        this.checkPosition = this.checkPosition.bind(this);
        this.remainingBlockColumns = this.remainingBlockColumns.bind(this);
        this.remainingBlockRows = this.remainingBlockRows.bind(this);
        this.checkPossible = this.checkPossible.bind(this);
        this.checkGridStepwise = this.checkGridStepwise.bind(this);
    }

    //i = Row, j = Column
    buildGrid() {
        let result = [];

        for (let i = 0; i < 9; i++) {
            result.push([]);
            for (let j = 0; j < 9; j++) {
                result[i].push(
                    <input
                        key={i + j}
                        type={"text"}
                        value={this.state.grid[i][j]}
                        onChange={(input, value) => {
                            this.changeField(i, j, input)
                        }
                        }
                    />
                );

                if ((j + 1) % 3 === 0) {
                    result[i].push(<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>);
                }
            }
            result[i].push(<br/>);

            if ((i + 1) % 3 === 0) {
                result[i].push(<br/>);
            }
        }
        return result;
    }

    changeField(i, j, input) {
        let tempGrid = this.state.grid;
        tempGrid[i][j] = input.target.value;

        return this.setState({grid: tempGrid});
    }

    //Gibt alle Zahlen zurueck die in der Reihe noch nicht vorkommen
    checkRow(row, column) {
        let allResult = [];
        let remainingRows = this.remainingBlockRows(row, column);
        remainingRows.push(row);

        for (let i = 0; i < 3; i++) {
            let j = this.state.grid[remainingRows[i]];

            let base = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
            let result = [];

            base.forEach((a, b, c) => {
                if (j.indexOf(a) === -1) {
                    result.push(a);
                }
            });

            allResult.push(result);
        }
        return allResult;
    }

    //Gibt alle Zahlen zurueck die in der Spalte noch nicht vorkommen
    checkColumn(row, column) {
        let allResult = [];
        let remainingColumns = this.remainingBlockColumns(row, column);
        remainingColumns.push(column);

        for (let i = 0; i < 3; i++) {

            let j = [];
            for (let k = 0; k < 9; k++) {
                j.push(this.state.grid[k][remainingColumns[i]]);
            }

            let base = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
            let result = [];

            base.forEach((a, b, c) => {
                if (j.indexOf(a) === -1) {
                    result.push(a);
                }
            });
            allResult.push(result);
        }
        return allResult;
    }

    //Gibt die beiden anderen Reihen in einem Block zurueck
    remainingBlockRows(row, column) {
        let blockPos = this.determinBlock(row, column);
        let result = [];

        for (let i = blockPos.row * 3; i < (blockPos.row * 3) + 3; i++) {
            if (row !== i) {
                result.push(i);
            }
        }
        return result;
    }

    remainingBlockColumns(row, column) {
        let blockPos = this.determinBlock(row, column);
        let result = [];

        for (let i = blockPos.column * 3; i < (blockPos.column * 3) + 3; i++) {
            if (column !== i) {
                result.push(i);
            }
        }
        return result;
    }

    checkBlock(row, column) {
        let block = [];
        let base = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let result = [];

        for (let i = row * 3; i < (row * 3) + 3; i++) {
            for (let j = column * 3; j < (column * 3) + 3; j++) {
                block.push(this.state.grid[i][j]);
            }
        }

        base.forEach((a, b, c) => {
            if (block.indexOf(a) === -1) {
                result.push(a);
            }
        });

        return result;
    }

    determinBlock(row, column) {
        let i = 0;
        if (row < 3) {
            i = 0
        }
        if (row > 2 && row < 6) {
            i = 1
        }
        if (row > 5) {
            i = 2
        }

        let j = 0;
        if (column < 3) {
            j = 0
        }
        if (column > 2 && column < 6) {
            j = 1
        }
        if (column > 5) {
            j = 2
        }

        return {row: i, column: j};
    }

    checkPossible(row, column, value) {
        let i = this.state.grid[row];
        let j = [];
        for (let k = 0; k < 9; k++) {
            j.push(this.state.grid[k][column]);
        }

        return (i.indexOf(value) === -1 && j.indexOf(value) === -1)
    }

    checkPosition(row, column) {
        if (this.state.grid[row][column] !== "0") {
            return this.state.grid[row][column];
        }

        let i = this.checkRow(row, column);
        let j = this.checkColumn(row, column);
        let blockPos = this.determinBlock(row, column);
        let block = this.checkBlock(blockPos.row, blockPos.column);

        let rcOptions = [];
        i[2].forEach((a, b, c) => {
            if (j[2].indexOf(a) !== -1) {
                rcOptions.push(a);
            }
        });

        // console.log("Row Column Options without block ", rcOptions);

        rcOptions.forEach((a, b, c) => {
            if (block.indexOf(a) === -1) {
                rcOptions.splice(b, 1);
            }
        });

        // console.log("Row Column Options with block ", rcOptions);

        if (rcOptions.length > 0) {

            for (let k = blockPos.row * 3; k < (blockPos.row * 3) + 3; k++) {
                for (let l = blockPos.column * 3; l < (blockPos.column * 3) + 3; l++) {
                    let deletion = true;
                    while (deletion) {
                        deletion = false;

                        for (let m = 0; m < rcOptions.length; m++) {
                            if ((this.checkPossible(k, l, rcOptions[m]))
                                && (this.state.grid[k][l] === "0")
                                && ((k !== row) || (l !== column))
                            ) {
                                if (rcOptions.indexOf(rcOptions[m] > -1)) {
                                    deletion = true;
                                    rcOptions.splice(m, 1);
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log("Row Column Options after all other Block Fields: ", rcOptions, " for ", row, column);

        if (rcOptions.length === 1) {
            let solution = this.state.solution;
            solution.push([row, column, rcOptions[0]]);
            this.setState({solution: solution});
        }

        return (rcOptions.length === 1 ? rcOptions[0] : "0")
    }

    removeDuplicates(row1, row2, row3) {
        row1.forEach((a, b, c) => {
            if (row2.indexOf(a) > -1 || row3.indexOf(a) > -1) {
                row1.splice(row1.indexOf(a), 1);
            }
        });

        return row1;
    }

    checkGrid() {
        let stillUnsolved = true;
        let counter = 0;
        let broke = false;

        while (stillUnsolved) {
            counter++;
            let grid = [];
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    grid = this.state.grid;
                    grid[i][j] = this.checkPosition(i, j);
                    this.setState({grid: grid});
                }
            }

            stillUnsolved = false;
            for (let k = 0; k < 9; k++) {
                if (this.state.grid[k].indexOf("0") > -1) {
                    stillUnsolved = true;
                }
            }

            if (counter === 50) {
                stillUnsolved = false;
                broke = true;
                console.error("Puzzle could not be solved in the given Steps.");
            }
        }

        if (!broke) {
            console.log("Puzzle has been solved in ", counter, "Steps");
        }
    }

    setBasis() {
        const basis = this.state.grid;
        console.log(basis);
    }

    checkGridStepwise() {
        this.checkGrid();
        console.log(this.state.solution);
    }

    render() {
        return (
            <div className="App">
                {this.buildGrid()}
                <button onClick={this.checkGrid}>Solve</button>
                <button onClick={this.setBasis}>Solve next Step</button>
            </div>
        );
    }
}

export default App;
