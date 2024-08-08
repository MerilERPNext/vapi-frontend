import {useEffect, useRef} from "react";
import {FormBuilder} from "formiojs";

const FormbuilderComponent = () => {
    const formBuilder = useRef(null);
    useEffect(() => {
        if (formBuilder.current) {
            const builder = new FormBuilder(
                formBuilder.current,
                {},
                {
                    baseUrl: window.location.origin,
                }
            );
            builder.instance.on("change",()=>{
                console.log("change")
            })
        }
    },[])

    return (
        <div>
            <div ref={formBuilder}></div>
        </div>
    );
};

export default FormbuilderComponent;