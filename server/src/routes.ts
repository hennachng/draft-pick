import { Request, Response } from "express";

// Description of an individual draft
// RI: id, rounds >= 0
export type Draft = {
  options: string[];
  drafters: string[];
  picked: string[];
  picker: string;
  rounds: number;
  id: number;
  isComplete: boolean;
}

// Map of items in the Draft
// RI: No two items have the same ID
const picks: Map<number, Draft> = new Map();

/**
 * Creates a new draft with the provided drafters, options,
 * number of rounds.
 * @param req The request object.
 * @param res The response object.
 */
export function CreateDraft(req: Request, res: Response) {
  const id = picks.size;
  const drafters = req.body.drafters;
  if (drafters === undefined || drafters.length < 2) {
    res.status(400).send("missing 'drafters' parameter");
    return;
  }

  const options = req.body.options;
  if (options === undefined || options.length < 2) {
    res.status(400).send("missing 'options' parameter");
    return;
  }

  const rounds = req.body.rounds;
  if (rounds === undefined || typeof rounds !== 'number') {
    res.status(400).send("missing 'rounds' parameter");
    return;
  }

  const optionsCopy: string[] = [];
  for (let i = 0; i < options.length; i++) {
    optionsCopy.push(options[i]);
  }

  const draftersCopy: string[] = [];
  for (let i = 0; i < drafters.length; i++) {
    if (draftersCopy.indexOf(drafters[i]) === -1) {
      draftersCopy.push(drafters[i]);
    }
  }

  const draft: Draft = {
    id: id,
    rounds: rounds,
    picker: drafters[0],
    options: optionsCopy,
    drafters: draftersCopy,
    picked: [],
    isComplete: false
  };

  picks.set(id, draft);
  res.send({ draft: draft })
}

/**
 * Handles the picking process in the given draft.
 * @param req The request object.
 * @param res The response object.
 */
export function DraftPick(req: Request, res: Response) {
  const id = req.body.id;
  if (id === undefined || typeof id !== 'number') {
    res.status(400).send("missing 'id' parameter");
    return;
  }

  const draft = picks.get(id)
  if (draft === undefined) {
    res.status(400).send("draft does not exist");
    return;
  }

  const pick = req.body.pick;
  if (pick === "") {
    res.status(400).send("missing 'pick' parameter");
    return;
  }

  const pickIndex = draft.options.indexOf(pick);
  if (pickIndex === -1) {
    res.status(400).send("Pick does not exist");
    return;
  }

  draft.picked.push(draft.picker + " " + pick + " " + (draft.picked.length + 1));
  draft.options.splice(pickIndex, 1);
  if (draft.drafters.indexOf(draft.picker) === draft.drafters.length - 1) {
    draft.rounds--;
    draft.picker = draft.drafters[0];
  } else {
    draft.picker = draft.drafters[draft.drafters.indexOf(draft.picker) + 1];
  }

  if (draft.options.length === 0 || draft.rounds === 0) {
    draft.isComplete = true;
  }

  res.send({ draft: draft });
}

/**
 * Loads the draft corresponding to the given id
 * @param req The request object.
 * @param res The response object.
 */
export function LoadDraft(req: Request, res: Response) {
  const idString = req.query.id as string;
  const idNumber = parseInt(idString);
  if (idNumber === undefined || typeof idNumber !== 'number') {
    res.status(400).send("missing 'id' parameter");
    return;
  }

  if (!picks.has(idNumber)) {
    res.status(400).send("draft ID does not exist!");
    return;
  }

  const draft = picks.get(idNumber);
  res.send({ draft: draft });
}

export function reset(_: Request, __: Response) {
  picks.clear();
}

/** Returns a list of all the named save files. */
export function Dummy(req: Request, res: Response) {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
  } else {
    res.json(`Hi, ${name}`);
  }
}

// Helper to return the (first) value of the parameter if any was given.
// (Client can also give mutiple values, in which case, express puts them into an array.)
function first(param: any): string | undefined {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
}


