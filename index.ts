import { IInputs, IOutputs } from "./generated/ManifestTypes";
interface NominatimResult {
    display_name: string;
    lat: string;
    lon: string;
}
let typingTimer: number | undefined;

export class populateAddressControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _input: HTMLInputElement;
    private _suggestions: HTMLDivElement;
    private _value: string;
    private _countryCode: string ;
    private _notifyOutputChanged: () => void;
    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
      
 this._countryCode = context.parameters.countryCode.raw || "ae"; // default fallback
 this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;
this._input = document.createElement("input");
this._suggestions = document.createElement("div");
        // Create input field
       this._input.style.width = "100%";
// Input box
this._input.style.width = "100%";
this._input.style.padding = "8px 12px";        // padding left/right
this._input.style.border = "1px solid #ccc";
this._input.style.borderRadius = "4px";       // slightly more rounded
this._input.style.fontSize = "14px";
this._input.style.boxSizing = "border-box";   // ensures padding included in width
this._input.style.outline = "none";           // remove default outline

// Suggestions dropdown
this._suggestions.style.position = "absolute";
this._suggestions.style.background = "#fff";
this._suggestions.style.border = "1px solid #ccc";
this._suggestions.style.borderTop = "none";  // connect to input box
this._suggestions.style.borderRadius = "0 0 4px 4px";  // rounded bottom corners
this._suggestions.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
this._suggestions.style.maxHeight = "150px";
this._suggestions.style.overflowY = "auto";
this._suggestions.style.zIndex = "9999";
this._suggestions.style.width = "100%";       // match input width


        // Append elements to container
        this._container.appendChild(this._input);
        this._container.appendChild(this._suggestions);

        // Input event with debounce
        let typingTimer: number | undefined;
        this._input.addEventListener("input", () => {
            if (typingTimer) clearTimeout(typingTimer);
            typingTimer = window.setTimeout(() => this.fetchSuggestions(this._input.value), 500);
        });
this.setupKeyboardNavigation();
        // Hide suggestions on outside click
        document.addEventListener("click", (e: MouseEvent) => {
            if (!this._container.contains(e.target as Node)) {
                this._suggestions.style.display = "none";
            }
        });
    }
private activeSuggestionIndex = -1; // for keyboard nav

private fetchSuggestions(query: string): void {
    if (!query || query.length < 3) {
        this._suggestions.style.display = "none";
        return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=${this._countryCode}&limit=5`;

    interface NominatimResult {
        display_name: string;
        lat: string;
        lon: string;
    }

    /* eslint-disable promise/always-return */
    fetch(url)
        .then((res): Promise<NominatimResult[]> => {
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return res.json() as Promise<NominatimResult[]>;
        })
        .then((results: NominatimResult[]): void => {
            this._suggestions.innerHTML = "";
            this.activeSuggestionIndex = -1;

            if (!results || results.length === 0) {
                this._suggestions.style.display = "none";
                return;
            }

            results.forEach((r: NominatimResult, idx: number): void => {
                const div = document.createElement("div");
                div.textContent = r.display_name;
                div.style.padding = "8px";
                div.style.cursor = "pointer";
                div.style.fontSize = "14px";
                div.dataset.index = idx.toString();

                div.addEventListener("click", (): void => {
                    this.selectSuggestion(r.display_name);
                });

                div.addEventListener("mouseover", (): void => {
                    this.highlightSuggestion(idx);
                });

                this._suggestions.appendChild(div);
            });

            this._suggestions.style.display = "block";
        })
        .catch((error: unknown): void => {
            console.error("Error fetching address suggestions:", error);
        });
    /* eslint-enable promise/always-return */
}



// Select suggestion
private selectSuggestion(value: string): void {
    this._value = value;
    this._input.value = value;
    this._suggestions.style.display = "none";
    this._notifyOutputChanged();
}

// Highlight suggestion by index
private highlightSuggestion(index: number): void {
    const children = Array.from(this._suggestions.children) as HTMLDivElement[];
    children.forEach((child, idx) => {
        child.style.background = idx === index ? "#e6f0ff" : "#fff";
    });
    this.activeSuggestionIndex = index;
}

// Keyboard navigation
private setupKeyboardNavigation(): void {
    this._input.addEventListener("keydown", (e: KeyboardEvent) => {
        const children = Array.from(this._suggestions.children) as HTMLDivElement[];
        if (children.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            const nextIndex = (this.activeSuggestionIndex + 1) % children.length;
            this.highlightSuggestion(nextIndex);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const prevIndex = (this.activeSuggestionIndex - 1 + children.length) % children.length;
            this.highlightSuggestion(prevIndex);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (this.activeSuggestionIndex >= 0) {
                const selected = children[this.activeSuggestionIndex].textContent!;
                this.selectSuggestion(selected);
            }
        }
    });
}

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const newValue = context.parameters.addressField.raw || "";
        if (newValue !== this._value) {
            this._value = newValue;
            this._input.value = newValue;
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
       return {
            addressField: this._value
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
