class UIManager {
    
constructor(){

}

init(){
//----INFO----
    this.title = document.getElementById("title");
    this.description = document.getElementById("description");
    this.extra = document.getElementById("extraInfo");
//---Selects----
     this.categorySelect =
    document.getElementById("categorySelect");
    this.itemSelect =
        document.getElementById("itemSelect");
    this.groupSelect =
        document.getElementById("groupSelect");
    this.qualitySelect =
        document.getElementById("qualitySelect");

//-----BUTTONS----
    this.nextButton =
        document.getElementById("nextButton");
    this.previousButton =
        document.getElementById("previousButton");
    this.autoplayButton =
        document.getElementById("autoplayButton");
        console.log(
    "PLAY BUTTON:",
    this.autoplayButton
);

//-----FILTERS---
    this.groupFilter =
    document.getElementById("groupFilter");
    this.qualityFilter =
    document.getElementById("qualityFilter");
//----PLAYBACK---
    this.speedSlider =
        document.getElementById("speedSlider");
    this.speedValue =
        document.getElementById("speedValue");

    this.registerEvents();

}

registerEvents() {

    if (this.itemSelect) {

        this.itemSelect.onchange = e => {

            this.controller?.select(

                Number(e.target.value)

            );

        };

    }

    if (this.groupSelect) {

        this.groupSelect.onchange = () => {

            this.controller?.applyFilter();

        };

    }

    if (this.qualitySelect) {

        this.qualitySelect.onchange = () => {

            this.controller?.applyFilter();

        };

    }

    if (this.nextButton) {

        this.nextButton.onclick = () => {

            this.controller?.next();

        };

    }

    if (this.previousButton) {

        this.previousButton.onclick = () => {

            this.controller?.previous();

        };

    }

   if (this.autoplayButton) {

    this.autoplayButton.onclick = () => {

        console.log("PLAY BUTTON CLICK");

        console.log(
            "CONTROLLER:",
            this.controller
        );

        console.log(
            "PLAY METHOD:",
            this.controller?.play,
            typeof this.controller?.play
        );

        this.controller?.play();

    };

}

    if (this.speedSlider) {

        this.speedSlider.oninput = () => {

            const bpm = Number(this.speedSlider.value);

            this.controller?.setBpm(bpm);

        };

    }

}

    setTitle(text) {

        if (this.title) {
            this.title.textContent = text;
        }

    }

    setDescription(text) {

        if (this.description) {
            this.description.textContent = text;
        }

    }

    setExtra(text) {

        if (this.extra) {
            this.extra.textContent = text;
        }

    }

    setInfo(model) {

    this.setTitle(model.title);

    this.setDescription(model.description);

    this.setExtra(model.extra);

}

   fillSelect(models) {

    if (!this.itemSelect) return;

    this.itemSelect.innerHTML = "";

    models.forEach((model, index) => {

        const option =
            document.createElement("option");

        option.value = index;

        option.textContent = model.title;

        this.itemSelect.appendChild(option);

    });

}

    setItemIndex(index) {

        if (!this.itemSelect) return;

        this.itemSelect.value = index;

    }

    setSpeedValue(bpm) {

    this.speedValue.textContent =
        bpm + " BPM";

}


onSpeedChange(callback) {

    if (!this.speedSlider) {
        return;
    }

    this.speedSlider.oninput = e => {

        callback(Number(e.target.value));

    };

}

setCategory(route) {

    if (!this.categorySelect) return;

    this.categorySelect.value = route;

}

fillCategories(modules) {

    if (!this.categorySelect) return;

    this.categorySelect.innerHTML = "";

    modules.forEach(module => {

        const option =
            document.createElement("option");

        option.value = module.id;
        option.textContent = module.title;

        this.categorySelect.appendChild(option);

    });

}

onCategoryChange(callback) {

    if (!this.categorySelect) return;

    this.categorySelect.onchange = () =>

        callback(this.categorySelect.value);

}

onGroupChange(callback) {

    if (!this.groupSelect) return;

    this.groupSelect.onchange = () => {

        callback(this.groupSelect.value);

    };

}

onQualityChange(callback) {

    if (!this.qualitySelect) return;

    this.qualitySelect.onchange = () =>

        callback(this.qualitySelect.value);

}

getGroup() {

    return this.groupSelect.value;

}

getQuality() {

    return this.qualitySelect.value;

}

 setController(controller) {

    this.controller = controller;

}


fillFilter(select, values) {

    if (!select) return;

    select.innerHTML = "";

    const all =
        document.createElement("option");

    all.value = "";
    all.textContent = "Všetky";

    select.appendChild(all);

    values.forEach(value => {

        const option =
            document.createElement("option");

        option.value = value;
        option.textContent = value;

        select.appendChild(option);

    });

}

fillGroups(groups) {

    this.fillFilter(
        this.groupSelect,
        groups
    );

}

fillQualities(qualities) {

    this.fillFilter(
        this.qualitySelect,
        qualities
    );
   

}


showGroup(show) {

    if (!this.groupFilter) return;

    this.groupFilter.style.display =
        show ? "" : "none";

}

showQuality(show) {

    if (!this.qualityFilter) return;

    this.qualityFilter.style.display =
        show ? "" : "none";

}


}

window.UIManager = UIManager;