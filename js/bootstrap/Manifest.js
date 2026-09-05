function group(path, files) {

    return files.map(file => path + file);

}

window.Manifest = {

   
    common: [

    ...group("js/common/", [

        "BaseRegistry.js",
        "ComponentRegistry.js",
        "ServiceRegistry.js",
        "EventBus.js"
        
    ])

],

 // =====================================================
    // BASE
    // =====================================================

    base: [
         ...group("js/renderers/fretboard/", [

           "SVGDrawer1.js"

        ]),

        ...group("js/base/", [

            "ContentRenderer.js",
            "BaseBuilder.js",
            "BaseFactory.js",
            "BaseRenderer.js",
            "BaseRepository.js",
            "BaseController.js",
            "BaseView.js"

        ])

    ],

     // =====================================================
    // PLAYBACK
    // =====================================================

    playback: [

        ...group("js/playback/", [

            "PlaybackCursor.js"
           
        ])

    ],
    

    // =====================================================
    // CORE
    // =====================================================

    core: [

        ...group("js/core/", [

            "Debug.js",
            "Database.js",
           "Player.js"
           

        ])

    ],

   
     // =====================================================
    // MUSIC
    // =====================================================

    music: [

        ...group("js/music/", [

            "Frequency.js",
            "GuitarDatabase.js",
            "MusicDatabase.js"

        ])

    ],

    // =====================================================
    // AUDIO
    // =====================================================
audio: [

        ...group("js/audio/", [

           "MidiPlayer.js",
           "Voice.js",
           "GuitarVoice.js",
           "InstrumentPreset.js",
           "GuitarPreset.js",
            "Tone.js"
           
           
        ])

    ],

    // =====================================================
    // MODELS
    // =====================================================

    models: [

        ...group("js/models/", [

            "TabModel.js",
            "PresentationModel.js",
            "PlaybackFrame.js",
            "PlaybackSequence.js"

        ])

    ],

    // =====================================================
    // BUILDERS
    // =====================================================

    builders: [

        ...group("js/builders/", [

            "LayoutBuilder.js",
            "MeasureLayoutBuilder.js",
            "FretboardBuilder.js",
            "NotationBuilder.js",
            "TabBuilder.js",
            "PlaybackBuilder.js"

        ])

    ],

    // =====================================================
    // PLAYBACK
    // =====================================================

    playback: [

        ...group("js/playback/", [

            "PlaybackEngine.js"

        ])

    ],
    

    // =====================================================
    // MODULES
    // =====================================================

    modules: [

        ...group("js/modules/", [

            "Modules.js"

        ])

    ],

     // =====================================================
    // PAINTERS
    // =====================================================

   painters: [

    ...group("js/painters/", [

        "BasePainter.js",
        "NotationUtils.js",
       
"StaffPainter.js",
"LedgerLinePainter.js",
 "ClefPainter.js",
"StemPainter.js",
"MeasureBarPainter.js",
"NotePositionCalculator.js",
"NotePainter.js",
"MeasurePainter.js",
"FretboardPainter.js",
"NotationPainter.js",
"TabPainter.js"

    ])

],
    

    // =====================================================
    // RENDERERS
    // =====================================================

    renderers: [

        ...group("js/renderers/", [

             "Theme.js",
            "RendererEngine.js",
            "render_playtab.js"

        ]),

       
        ...group("js/renderers/notation/layout/", [

            "NotationLayout.js"

        ]),

        ...group("js/renderers/notation/factory/", [

            "VoiceFactory.js",
            "NoteFactory.js",
            "SVGFactory.js"

        ]),
         ...group("js/renderers/notation/", [

           "MeasureRenderer.js"
        
        ]),

        ...group("js/renderers/fretboard/", [

            "FretboardRenderer.js",
           
        ]),

        ...group("js/renderers/notation/", [

          "NotationRenderer.js"

        ]),

        ...group("js/renderers/tab/", [

            "TabRenderer.js",
            "LessonLoader.js"

        ])

    ],

   


    // =====================================================
    // REPOSITORY
    // =====================================================

    repositories: [

        ...group("js/repositories/", [

            "LessonsRepository.js",
            "ChordsRepository.js",
            "ExercisesRepository.js",
            "IntervalsRepository.js",
            "ScalesRepository.js"
                      

        ])

    ],

    // =====================================================
    // ADAPTERS
    // =====================================================

    adapters: [

        ...group("js/adapters/", [

            "BaseAdapter.js",
            "ChordAdapter.js",
            "ExerciseAdapter.js",
            "IntervalAdapter.js",
            "ScaleAdapter.js",
            "SongAdapter.js"

        ])

    ],

    // =====================================================
    // CONTROLLERS
    // =====================================================

    controllers: [

        ...group("js/controllers/", [

            "ChordController.js",
            "ExerciseController.js",
            "IntervalController.js",
            "ScaleController.js"

        ])

    ],

    // =====================================================
    // UI
    // =====================================================

    ui: [

        ...group("js/ui/", [

            "UIManager.js"

        ])

    ],

     // =====================================================
    // VIEW
    // =====================================================

    view: [

        ...group("js/view/", [

            "FretboardView.js",
            "NotationView.js",
            "TabView.js"

        ])

    ],
    // =====================================================
    // APP
    // =====================================================

    app: [

         ...group("js/app/", [

        "ApplicationBuilder.js",
        "PageManager.js",
        "Router.js",
        "AppState.js",
        "App.js"

        ])        

    ]

};