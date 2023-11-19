// Henna Chung - Drafter App 2023.
// The Editor component manages the rendering and interaction for the drafting process.
// It includes functionality for displaying draft information, handling draft picks,
// and refreshing the draft status by communicating with the server. 
import React, { Component, ChangeEvent } from "react";
import { Draft } from './app';
import "./styles.css";

interface DraftProps {
  draft: Draft;
  picker: string;
}

interface DraftEdit {
  pick: string;
  picker: string;
  draftEdit: Draft;
}

export class Editor extends Component<DraftProps, DraftEdit> {
  // Constructor and initializing state
  constructor(props: any) {
    super(props);

    this.state = {
      picker: props.picker,
      draftEdit: props.draft,
      pick: "",
    };
  }

  // Render the component based on the draft process
  render = (): JSX.Element => {
    // Variables for recurring use
    const draftEditOptions = this.state.draftEdit.options;
    const draftEditCompleted = this.state.draftEdit.isComplete;
    const draftEditPicker = this.state.draftEdit.picker;
    const draftEditPicked = this.state.draftEdit.picked;
    const draftEditID = this.state.draftEdit.id;
    // Listing the previous picks utilizing a table
    const picks: JSX.Element[] = [];
    // For each iteration, 'pick' is an element from 'this.state.draftEdit.picked',
    // and 'nameAndPick' is an array resulting from splitting 'pick' by a space.
    // The loop creates a JSX element ('<tr>') for each 'pick', with three '<td>' elements,
    // each displaying one part of the split 'pick'. The resulting JSX elements are added
    // to the 'picks' array, representing the information derived from each 'pick'.
    for (const pick of draftEditPicked) {
      const nameAndPick = pick.split(" ");
      picks.push(
        <tr key={pick}>
          <td key={nameAndPick[2]}>{nameAndPick[2]}</td>
          <td key={nameAndPick[0]}>{nameAndPick[0]}</td>
          <td key={nameAndPick[1]}>{nameAndPick[1]}</td>
        </tr>
      )
    }
    // Generate JSX for draft options.
    const optionsTwo: JSX.Element[] = [];
    for (const option of draftEditOptions) {
      optionsTwo.push(
        <option key={option} value={option}>{option}</option>
      );
    }
    // Render the component based on different draft scenarios
    if (!draftEditCompleted) { // Ongoing Draft process
      if (this.state.picker === draftEditPicker) {
        if (draftEditPicked.length === 0) {
          // Render when it's the picker's turn and no picks have been made
          return (
            <div className="draftingText">
              <h1 className="header">Draft "{draftEditID}" Status for "{this.state.picker}"</h1>
              <p>No picks made yet.</p>
              <p>It's your pick!</p>
              <select onChange={this.handlePickChange} value={this.state.pick}>
                <option>Select your value</option>
                {optionsTwo}
              </select>
              <br></br>
              <button disabled={this.state.pick === ""} type="button" onClick={(evt) => this.handlePick(evt)}>Draft</button>
            </div>
          )
        } else { // Render when it's the picker's turn and picks have been made
          return (
            <div className="draftingText">
              <h1 className="header">Draft "{draftEditID}" Status for "{this.state.picker}"</h1>
              <table>
                <tbody>
                  <tr>
                    <td key="Pick Number">#</td>
                    <td key="Drafter">Drafter</td>
                    <td key="Pick">Pick</td>
                  </tr>
                  {picks}
                </tbody>
              </table>
              <select onChange={this.handlePickChange} value={this.state.pick}>
                <option>Select your value</option>
                {optionsTwo}
              </select>
              <br></br>
              <button disabled={this.state.pick === ""} type="button" onClick={(evt) => this.handlePick(evt)}>Refresh</button>
            </div>
          )
        }
      } else { // Other drafter's turn
        if (this.state.draftEdit.picked.length === 0) {
          // Render when it's not the picker's turn and no picks have been made
          return (
            <div className="draftingText">
              <h1 className="header">Draft "{draftEditID}" Status for "{this.state.picker}"</h1>
              <p>No picks made yet.</p>
              <p>Waiting for "{draftEditPicker}" to choose...</p>
              <button type="button" onClick={this.handleRefresh}>Refresh</button>
            </div>
          )
        } else { // Render when it's not the picker's turn and picks have been made
          return (
            <div className="draftingText">
              <h1 className="header">Draft "{draftEditID}" Status for "{this.state.picker}"</h1>
              <table>
                <tbody>
                  <tr>
                    <td key="Pick Number">#</td>
                    <td key="Drafter">Drafter</td>
                    <td key="Pick">Pick</td>
                  </tr>
                  {picks}
                </tbody>
              </table>
              <p>Waiting for "{draftEditPicker}" to choose...</p>
              <button type="button" onClick={this.handleRefresh}>Refresh</button>
            </div>
          )
        }
      }
    } else { // Render when the draft is complete
      return (
        <div className="draftingText">
          <h1 className="header">Draft "{draftEditID}" Status</h1>
          <table>
            <tbody>
              <tr>
                <td key="Pick Number">#</td>
                <td key="Drafter">Drafter</td>
                <td key="Pick">Pick</td>
              </tr>
              {picks}
            </tbody>
          </table>
          <p>This draft is completed.</p>
        </div>
      )
    }
  }

  // Handles the draft picking process.
  // Make a POST request to the server to submit the draft pick information
  // Handle the response and update the component state accordingly
  handlePick = (_: React.MouseEvent<HTMLButtonElement>) => {
    fetch("/api/pick",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: this.state.draftEdit.id, picker: this.state.draftEdit.picker, pick: this.state.pick })
      })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          this.handleServerError(res)
          return;
        }
      }).then(res => {
        this.handleLoadJson(res);
        return;
      }).catch(this.handleServerError);
  }

  // Handles the refresh and updating the list
  // Make a GET request to the server to load the latest draft information
  // Handle the response and update the component state accordingly
  handleRefresh = () => {
    const url = "/api/load" +
      "?id=" + encodeURIComponent(this.state.draftEdit.id);
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
  }

  // Handle the response from a request to /load or /pick
  // Check if it's the picker's turn and update the component state
  // Alert: (1) Not current drafter's turn
  handleLoadJson = (val: any) => {
    const drafterName = val.draft.picker;
    if (this.state.draftEdit.picker === drafterName) {
      alert(`${drafterName}'s turn`);
      return;
    }
    this.setState({ draftEdit: val.draft });
  }

  // Handles the change in pick selection
  handlePickChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    // Update the component state with the selected pick
    this.setState({ pick: evt.target.value });
  }

  // Server error
  handleServerError = (_: Response) => {
    console.error(`unknown error talking to server`);
  };

}    