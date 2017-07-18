import * as React from 'react';
import {Link, withRouter, RouteComponentProps} from 'react-router-dom';
import './gallery.css';

export type OwnProps = {
  images: string[];
};

export type GalleryProps = OwnProps & RouteComponentProps<null>;

export class Gallery extends React.Component<GalleryProps, {}> {
  props: GalleryProps;

  render() {
    return (
      <div className="zv-gallery">
        {this.props.images.map((imageUrl, index) =>
          <Link
            key={`zv-gallery-item-${index}`}
            to={`/portfolio/image/?url=${imageUrl}`}
            className="zv-gallery-item bg-faded m-2"
            style={{backgroundImage: `url(${imageUrl})`}}
          />
        )}
      </div>
    );
  }
}

export const GalleryWithRouter = withRouter<OwnProps>(Gallery);