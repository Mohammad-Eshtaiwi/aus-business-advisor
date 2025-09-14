export type SuggestionsState = {
  isLoading: boolean;
  error: string | null;
  suggestions: string;
};

export type SuggestionsAction =
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS'; payload: string }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' };

export const initialState: SuggestionsState = {
  isLoading: false,
  error: null,
  suggestions: '',
};

export function suggestionsReducer(
  state: SuggestionsState,
  action: SuggestionsAction
): SuggestionsState {
  switch (action.type) {
    case 'SUBMIT':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'SUCCESS':
      return {
        isLoading: false,
        error: null,
        suggestions: action.payload,
      };
    case 'ERROR':
      return {
        isLoading: false,
        error: action.payload,
        suggestions: '',
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
