// Henna Chung - Drafter App 2023.
// The App (Draft) component manages the creation and joining of drafting sessions.
// It includes functionality for creating a new draft with specified options, drafters, and rounds.
// Users can join an existing draft by providing a valid draft ID and their drafter name.
import React, { Component, ChangeEvent } from "react";
import { Editor } from './editor';
import "./styles.css";


// Defines the structure of an individual draft
// RI: rounds, id >= 0
export type Draft = {
  options: string[]; // Possible options
  drafters: string[]; // Existing drafters
  picked: string[]; // Picked options
  picker: string; // Current drafter turn
  rounds: number; // # of rounds
  id: number; // Unique draft id
  isComplete: boolean; // Completed draft indication
}

// Describes the state of the component
// - Manages information about the current page
interface AppState {
  page: boolean;
  picker: string;
  id: number;
  rounds: number;
  options: string[] | undefined;
  drafters: string[] | undefined;
  draft: Draft;
}


// Top-level component that displays the appropriate page. 
export class App extends Component<{}, AppState> {
  // Constructor and initializing state
  constructor(props: any) {
    super(props);

    this.state = {
      page: false,
      picker: "",
      id: 0,
      rounds: 0,
      options: undefined,
      drafters: undefined,
      draft: {
        drafters: [],
        options: [],
        picked: [],
        rounds: 0,
        id: 0,
        isComplete: false,
        picker: ""
      }
    };
  }

  // Render logic for creating and joining a draft
  render = (): JSX.Element => {
    if (!this.state.page) {
      return (<div className="App">
        <h1 className="header">Draft Pick</h1>
        <form className="draftText">
          <div className="drafter-section">
            <label htmlFor="drafterName">Drafter Name:</label>
            <br></br>
            <input type="text" id="drafterName" onChange={this.handleDrafterChange} />
          </div>
          <h1>Join Existing Draft</h1>
          <div className="id-section">
            <label htmlFor="draftID">ID:</label>
            <input type="text" id="draftID" onChange={this.handleIDChange} />
          </div>
          <br />
          <button type="button" onClick={this.handleJoin}>Join</button>
          <h1>Create New Draft</h1>
          <div className="rounds-section">
            <label htmlFor="rounds">Rounds:</label>
            <input type="number" id="rounds" onChange={this.handleRoundChange} />
          </div>
          <br />
          <br />
          <div className="inline-txt">
            <div className="columns">
              <label htmlFor="options">Options:</label>
              <label htmlFor="drafters">Drafters:</label>
            </div>
            <div className="columns">

              <textarea onChange={this.handleOptionsChange}></textarea>
              <textarea onChange={this.handleDraftersChange}></textarea>
            </div>
          </div>
          <button type="button" onClick={this.handleCreate}>Create</button>
        </form>
      </div>);
    } else {
      return (<div className="App">
        <Editor
          draft={this.state.draft}
          picker={this.state.picker}
        />
      </div>
      )
    }
  };

  // Handles the creation of a draft.
  // Alert: (1) Drafters and options are not filled in (2) Rounds <= 0
  handleCreate = () => {
    if (this.state.drafters === undefined || this.state.options === undefined || this.state.rounds <= 0) {
      alert("You did not fill out the required information (Name, Options, Drafters, and/or Rounds");
      return;
    }

    fetch('/api/create',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rounds: this.state.rounds,
          options: this.state.options, drafters: this.state.drafters
        })
      })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          this.handleServerError(res);
          return;
        }
      }).then(res => {
        this.handleLoadJson(res);
        return;
      }).catch(this.handleServerError);
  }

  // Handles joining process of a draft if the ID exists.
  // Allows for spectators to join
  // Alert: (1) ID does not exist (2) Name has not been inputted
  handleJoin = () => {
    if (this.state.id === undefined) {
      alert("No id inputted");
      return;
    }

    if (this.state.picker !== "") {
      const url = "/api/load" +
        "?id=" + encodeURIComponent(this.state.id);
      fetch(url).then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          alert("This ID does not exist!");
          this.handleServerError(res);
          return;
        }
      }).then(res => {
        this.handleLoadJson(res);
        return;
      }).catch(this.handleServerError);
    } else {
      alert("Input a name!");
    }

  }

  // Handles the response from a request to /create or /load.
  // Alert: (1) Drafter is not part of this draft
  handleLoadJson = (val: any) => {
    if (!val.draft.drafters.includes(this.state.picker)) {
      alert("You do not exist in this draft");
      return;
    }

    this.setState({ page: true, draft: val.draft });
  }

  // Handles the input changes for drafters.
  // Ensures no duplicate names are allowed.
  handleDraftersChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    const drafters = evt.target.value.split("\n");
    const draftersSet = new Set(drafters); // Unique values
    const draftersUnique = Array.from(draftersSet);
    this.setState({ drafters: draftersUnique });
  };

  // Handles the input changes for rounds.
  handleRoundChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ rounds: parseInt(evt.target.value) });
  };

  // Handles the input changes for the drafter's name.
  // Alert: (1) Spaces in name
  handleDrafterChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    if (evt.target.value.includes(" ")) {
      alert("No spaces please!");
      return;
    }
    this.setState({ picker: evt.target.value });
  };

  // Handles input changes for the options available
  // Ensures no duplicate options are allowed
  handleOptionsChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    const options = evt.target.value.split("\n");
    const optionsSet = new Set(options); // Unique values
    const optionsUnique = Array.from(optionsSet);
    this.setState({ options: optionsUnique });
  };

  // Handles change in ID # inputted when attempting to join
  handleIDChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    const idNum = parseInt(evt.target.value);
    this.setState({ id: idNum });
  }

  // Server error handler
  handleServerError = (_: Response) => {
    console.error(`unknown error talking to server`);
  };
}