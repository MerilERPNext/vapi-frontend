import {useEffect, useRef} from "react";
import {FormBuilder} from "formiojs";

const FormbuilderComponent = () => {
    const formBuilder = useRef(null);
    useEffect(() => {
        if (formBuilder.current) {
            const builder = new FormBuilder(
                formBuilder?.current,
                JSON.parse(window?.cur_frm?.doc?.custom_form_data || '{}'),
                {
                    baseUrl: window?.location?.origin || '',
                }
            );
            builder?.instance?.on("change", () => {
                window?.cur_frm?.set_value("custom_form_data", JSON.stringify(builder.instance.form))
            })
        }
    }, [])

    return (
        <div>
            <div ref={formBuilder}></div>
        </div>
    );
};

export default FormbuilderComponent;